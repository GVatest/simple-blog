import React, { Dispatch, SetStateAction } from "react";
import DeleteIcon from "assets/actions/delete.svg";
import classes from "./delete.module.scss";
import { IPost } from "models";
import { PostContext } from "contexts";
import { postsClient } from "services";

type DeleteProps = {
  setState: Dispatch<SetStateAction<IPost[]>>;
};

function Delete({ setState }: DeleteProps) {
  async function handleDelete({ slug }: { slug: string }) {
    try {
      await postsClient.del(slug);
      setState((prev) => [...prev.filter((post) => post.slug !== slug)]);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <PostContext.Consumer>
      {(post) => (
        <DeleteIcon
          className={classes.delete}
          onClick={() => handleDelete(post)}
        />
      )}
    </PostContext.Consumer>
  );
}

export default Delete;
