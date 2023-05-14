import Head from "next/head";
import { useState } from "react";
import { Layout, Header, Search, PostsList, Sort } from "components";
import { IPost } from "models";
import { GetServerSideProps } from "next";
import classes from "./home.module.scss";
import { sortByDate } from "lib/client";
import { useWindowSize } from "utils";
import { prisma } from "common/server";
import { Footer } from "components";

type HomeProps = {
  initialPosts: IPost[];
};

export default function Home({ initialPosts }: HomeProps) {
  const { width: windowWidth } = useWindowSize();

  const [searchActive, setSearchActive] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchedPosts, setSearchedPosts] = useState<IPost[]>([]);
  const [sortedPosts, setSortedPosts] = useState<IPost[]>(
    sortByDate(initialPosts, true)
  );

  return (
    <>
      <Head>
        <title>Gvatest Blog</title>
        <meta name='description' content='Gvatest Blog' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Layout>
        <Header title='Blog' home='Gvatest'>
          {windowWidth && windowWidth > 600 && (
            <Search
              onSearch={setSearchActive}
              setLoading={setSearching}
              setResults={setSearchedPosts}
            />
          )}
        </Header>
        <main className={classes.main}>
          {windowWidth && windowWidth <= 600 && (
            <Search
              onSearch={setSearchActive}
              setLoading={setSearching}
              setResults={setSearchedPosts}
            />
          )}
          <Sort
            posts={searchActive ? searchedPosts : initialPosts}
            setPosts={setSortedPosts}
          />

          <PostsList posts={sortedPosts} loading={searching} />
        </main>
        <Footer />
      </Layout>
    </>
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
