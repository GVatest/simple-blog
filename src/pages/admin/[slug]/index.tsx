import { IPost } from "models";
import { GetServerSideProps } from "next";
import { postsClient } from "services";
import { Header, Layout, PostForm } from "components";
import Head from "next/head";
import classes from "./edit.module.scss";
import { useRouter } from "next/router";
import { filterCols } from "utils";
import { prisma } from "common/server";
import { findFile } from "lib/server";
import { POSTS_UPLOAD_DIR } from "constants/locales";

type EditPostProps = {
  post: IPost;
};

export default function EditPost({ post }: EditPostProps) {
  const router = useRouter();

  async function updatePost(
    newPost: Pick<IPost, "title" | "description"> & { file?: globalThis.File }
  ) {
    const formData = new FormData();
    const filteredValues = filterCols(post, newPost);

    if (!filteredValues.length && !newPost.file) {
      throw new Error("Nothing new");
    }
    if (filteredValues) {
      filteredValues.forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    if (newPost.file) {
      formData.append("file", newPost.file);
    }

    const { data, status, statusText } = await postsClient.put(
      formData,
      post.slug
    );

    switch (status) {
      case 201:
        console.log("Successfully updated");
        return;
      case 409:
        throw new Error(data as string);
      default:
        throw new Error(statusText);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Edit</title>
        <meta name='description' content='Edit post page' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Header title='Edit' home='Admin' homeLink='/admin' />
      <main className={classes.main}>
        <PostForm
          oldPost={post}
          redirect={() => router.push("/admin")}
          handleSubmit={updatePost}
        />
      </main>
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
      return {
        props: {
          post: { ...post },
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  }
};
