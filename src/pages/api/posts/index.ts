import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "common/server";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { SPost } from "schemas";
import slugify from "slugify";
import { POSTS_UPLOAD_DIR } from "constants/locales";
import { deleteFile, renameFile, parseForm } from "lib/server";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // get all posts
    case "GET":
      try {
        const data = await prisma.post.findMany();
        return res.status(200).json(data);
      } catch {
        return res.status(500).send("Failed to load posts");
      }
    // add next post
    case "POST":
      // check auth
      const token = await getToken({ req });
      if (token) {
        try {
          // parse form data and save file if exists
          let [fields, file] = await parseForm(req, POSTS_UPLOAD_DIR);
          // check if file exists
          if (!file) return res.status(400).send("File required");

          // validate text fields
          const validation = SPost.safeParse(fields);

          if (!validation.success) {
            return res.status(400).json(validation.error.issues);
          }

          // generate slug for post
          const slug = slugify(validation.data.title, { lower: true });

          // try to save new post in db
          try {
            const post = await prisma.post
              .create({
                data: {
                  ...validation.data,
                  slug: slug,
                },
              })
              .then((post) => {
                renameFile(file!, slug);
                return post;
              })
              .catch((e) => {
                deleteFile(file!);
                throw e;
              });

            return res.status(201).json(post);
          } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
              switch (e.code) {
                // check if same post already exists
                case "P2002":
                  return res
                    .status(409)
                    .send("Post with the same title already exists");
              }
            } else {
              return res.status(500).send("Failed to create new post");
            }
          }
        } catch (e) {
          return res.status(500).send("Failed to create new post");
        }
      } else {
        return res.status(401).end();
      }
    default:
      return res.status(405).end();
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
