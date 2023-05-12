import React from "react";
import EditIcon from "assets/actions/edit.svg";
import classes from "./edit.module.scss";
import { postsClient } from "services";
import { PostContext } from "contexts";
import { useRouter } from "next/router";

function Edit() {
  const router = useRouter();

  return (
    <PostContext.Consumer>
      {({ slug }) => (
        <EditIcon
          className={classes.edit}
          onClick={() => router.push(`/admin/${slug}`)}
        />
      )}
    </PostContext.Consumer>
  );
}

export default Edit;
