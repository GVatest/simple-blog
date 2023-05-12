import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "common/server";
import { NextApiRequest, NextApiResponse } from "next";
import { SPostOptional } from "schemas";
import slugify from "slugify";
import fs from "fs";
import { POSTS_UPLOAD_DIR } from "constants/locales";
import { deleteFile, renameFile, findFile, parseForm } from "lib/server";
import path from "path";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (typeof slug !== "string") {
    throw new Error("Invalid request");
  }

  switch (req.method) {
    case "GET":
      try {
        const post = await prisma.post.findUnique({
          where: { slug: slug },
        });
        if (!post) {
          return res.status(404).end();
        } else {
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
    case "DELETE":
      try {
        await prisma.post.delete({
          where: { slug: slug },
        });

        const filePath = findFile(
          path.resolve(process.cwd(), POSTS_UPLOAD_DIR),
          slug
        );

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
    case "PUT":
      try {
        const [fields, file] = await parseForm(req, POSTS_UPLOAD_DIR);
        const validation = SPostOptional.safeParse(fields);

        if (!validation.success) {
          return res.status(400).json(validation.error.issues);
        }

        if (!validation.data && file) return res.status(404).end("404");

        const newSlug = validation.data.title
          ? slugify(validation.data.title, { lower: true })
          : slug;
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
        if (e instanceof PrismaClientKnownRequestError) {
          switch (e.code) {
            case "P2025":
              return res.status(404).end("404");
          }
        }
        console.log(e);
        return res.status(500).send("Failed to update post");
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
