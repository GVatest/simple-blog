import {
  Delete,
  Edit,
  Header,
  Layout,
  PostsList,
  Search,
  Sort,
  Popup,
  PostForm,
  Logout,
} from "components";
import { sortByDate } from "lib/client";
import { IPost } from "models";
import Head from "next/head";
import { useState } from "react";
import classes from "./admin.module.scss";
import { GetServerSideProps } from "next";
import { postsClient } from "services";
import CreateIcon from "assets/actions/add.svg";
import { useWindowSize } from "utils";
import { prisma } from "common/server";

type AdminProps = {
  initialPosts: IPost[];
};

export default function Admin({ initialPosts }: AdminProps) {
  const { width: windowWidth } = useWindowSize();

  const [searchActive, setSearchActive] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchedPosts, setSearchedPosts] = useState<IPost[]>([]);
  const [onAdd, setOnAdd] = useState(false);
  const [sortedPosts, setSortedPosts] = useState<IPost[]>(
    sortByDate(initialPosts, true)
  );

  async function createPost(
    newPost: Pick<IPost, "title" | "description"> & { file?: globalThis.File }
  ) {
    if (!newPost.file) {
      throw new Error("File required");
    }

    const formData = new FormData();
    Object.entries(newPost).map(([key, value]) => {
      formData.append(key, value);
    });

    const { data, status, statusText } = await postsClient.post(formData);

    switch (status) {
      case 201:
        setOnAdd(false);
        setSortedPosts((prev) => [data as IPost, ...prev]);
      default:
        throw new Error(data as string);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Admin</title>
        <meta name='description' content='Admin page' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Header home='Admin' homeLink='/admin'>
        {windowWidth && windowWidth > 650 && (
          <Search
            onSearch={setSearchActive}
            setLoading={setSearching}
            setResults={setSearchedPosts}
          />
        )}
        <Logout />
      </Header>
      <main className={classes.main}>
        {onAdd && (
          <Popup title='Create new post' onClose={() => setOnAdd(false)}>
            <PostForm handleSubmit={createPost} />
          </Popup>
        )}
        {windowWidth && windowWidth <= 650 && (
          <Search
            onSearch={setSearchActive}
            setLoading={setSearching}
            setResults={setSearchedPosts}
          />
        )}
        <div className={classes.tools}>
          <div onClick={() => setOnAdd(true)} className={classes.add}>
            <CreateIcon />
          </div>
          <Sort
            posts={searchActive ? searchedPosts : initialPosts}
            setPosts={setSortedPosts}
          />
        </div>
        <PostsList
          posts={sortedPosts}
          loading={searching}
          actions={
            <>
              <Delete setState={setSortedPosts} />
              <Edit />
            </>
          }
        />
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.post.findMany();
  return {
    props: {
      initialPosts: data,
    },
  };
};
