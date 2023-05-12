import React, { PropsWithChildren } from "react";
import { IPost } from "models";
import { Spinner } from "components/shared";
import classes from "./posts_list.module.scss";
import { formatDate } from "utils";
import { PostContext } from "contexts";

type PostProps = {
  post: IPost;
};

type PostsLayoutProps = {
  posts: IPost[];
  loading: boolean;
  actions?: React.ReactNode;
};

function Post({ post, children }: PropsWithChildren<PostProps>) {
  return (
    <div className={classes.post}>
      <a href={post.slug}>
        <h2>{post.title}</h2>
      </a>
      <h3 className={classes.description}>{post.description}</h3>
      <div className={classes.footer}>
        <span className={classes.date}>{formatDate(post.date)}</span>
        <div className={classes.actions}>
          <PostContext.Provider value={post}>{children}</PostContext.Provider>
        </div>
      </div>
    </div>
  );
}

function PostsLayout({ posts, loading, actions }: PostsLayoutProps) {
  let content;

  if (loading) {
    content = <Spinner />;
  } else if (!posts.length) {
    content = <h2 className={classes.nothing}>{`Nothing =(`}</h2>;
  } else {
    content = (
      <div className={classes.posts}>
        {posts.map((post) => (
          <Post post={post} key={post.id}>
            {actions}
          </Post>
        ))}
      </div>
    );
  }

  return content;
}

export default PostsLayout;
