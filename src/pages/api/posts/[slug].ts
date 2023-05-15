import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "common/server";
import { NextApiRequest, NextApiResponse } from "next";
import { SPostOptional } from "schemas";
import slugify from "slugify";
import fs from "fs";
import { POSTS_UPLOAD_DIR } from "constants/locales";
import { deleteFile, renameFile, findFile, parseForm } from "lib/server";
import path from "path";
import { getToken } from "next-auth/jwt";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  const token = await getToken({ req });

  // check if slug matched string type
  if (typeof slug !== "string") {
    throw new Error("Invalid request");
  }

  switch (req.method) {
    // get post by slug
    case "GET":
      try {
        // find post by slug
        const post = await prisma.post.findUnique({
          where: { slug: slug },
        });

        if (!post) {
          return res.status(404).end();
        } else {
          // find, read and send post content
          const file = findFile(POSTS_UPLOAD_DIR, slug);
          if (file) {
            const content = fs.readFileSync(file);
            return res
              .status(200)
              .json({ ...post, content: content.toString() });
          } else {
            return res.status(404).end();
          }
        }
      } catch (e) {
        console.log(e);
        return res.status(500).send("Failed to load post");
      }
    // delete post by slug
    case "DELETE":
      if (token) {
        try {
          // delete post by slug
          await prisma.post.delete({
            where: { slug: slug },
          });

          // find file
          const filePath = findFile(
            path.resolve(process.cwd(), POSTS_UPLOAD_DIR),
            slug
          );

          // if file exists unlink it
          if (filePath) {
            fs.unlinkSync(filePath);
          }

          return res.status(204).end();
        } catch (e) {
          if (e instanceof PrismaClientKnownRequestError) {
            switch (e.code) {
              case "P2025":
                return res.status(404).end();
            }
          }
          return res.status(500).send("Failed to delete post");
        }
      } else {
        return res.status(401).end();
      }
    case "PUT":
      // update post
      if (token) {
        try {
          // TODO: do not save file before fileds validation
          // parse form data and update post file content
          const [fields, file] = await parseForm(req, POSTS_UPLOAD_DIR);

          // validate text fields
          const validation = SPostOptional.safeParse(fields);
          if (!validation.success) {
            return res.status(400).json(validation.error.issues);
          }
          if (!validation.data && file) return res.status(404).end("404");

          // create new slug
          const newSlug = validation.data.title
            ? slugify(validation.data.title, { lower: true })
            : slug;

          // try to update post
          try {
            const post = await prisma.post
              .update({
                where: { slug: slug },
                data:
                  newSlug === slug
                    ? validation.data
                    : { ...validation.data, slug: newSlug },
              })
              .then(async (post) => {
                // rename file if slug is defferent
                if (newSlug !== slug) {
                  const filepath = findFile(POSTS_UPLOAD_DIR, slug);
                  if (filepath) {
                    renameFile(filepath, newSlug);
                  } else {
                    throw new Error("File not found");
                  }
                }
                return post;
              })
              .catch((e) => {
                if (file) {
                  deleteFile(file, file.newFilename);
                }
                throw e;
              });

            return res.status(201).send(post);
          } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
               // check if same post already exists
              switch (e.code) {
                case "P2002":
                  return res
                    .status(409)
                    .send("Post with the same title already exists");
              }
            } else {
              console.log(e);
              return res.status(500).send("Failed to update post");
            }
          }
        } catch (e) {
          return res.status(500).send("Failed to update post");
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
