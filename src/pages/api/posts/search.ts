import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "common/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { q: query } = req.query;

      if (typeof query !== "string") {
        throw new Error("Invalid request");
      }

      const posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
              },
            },
            {
              description: {
                contains: query,
              },
            },
          ],
        },
      });

      res.status(200).json(posts);
    } catch (error: any) {
      console.log(error);
      res.status(500).end();
    }
  }
}
