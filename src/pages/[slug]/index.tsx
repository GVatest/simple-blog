// Post Page (display markdown)
import { IPost } from "models";
import { GetServerSideProps } from "next";
import { findFile, parseMD } from "lib/server";
import { Layout, Header } from "components";
import "github-markdown-css";
import classes from "./slug.module.scss";
import { prisma } from "common/server";
import { POSTS_UPLOAD_DIR } from "constants/locales";
import fs from "fs";

type PostPageProps = {
  post: IPost;
};

export default function PostPage({ post }: PostPageProps) {
  return (
    <Layout>
      <Header home='Gvatest' title={`${post.title}`}></Header>
      <div className={classes.post}>
        <div
          className={`${classes.markdown} markdown-body`}
          dangerouslySetInnerHTML={{ __html: post.content! }}
        ></div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  const post = await prisma.post.findUnique({
    where: { slug: slug },
  });
  if (!post) {
    return {
      notFound: true,
    };
  } else {
    const file = findFile(POSTS_UPLOAD_DIR, slug);
    if (file) {
      const content = fs.readFileSync(file);
      return {
        props: {
          post: { ...post, content: await parseMD(content.toString()) },
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  }
};
