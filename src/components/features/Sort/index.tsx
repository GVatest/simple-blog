import React, { useEffect, useState } from "react";
import Arrow from "assets/actions/arrow.svg";
import classes from "./sort.module.scss";
import { IPost } from "models";
import { sortByDate } from "lib/client";

type SortProps = {
  posts: IPost[];
  setPosts: (posts: IPost[]) => void;
};

export default function Sort({ posts, setPosts }: SortProps) {
  const [isDescend, setIsDescend] = useState(true);

  useEffect(() => {
    setPosts(sortByDate(posts, isDescend));
  }, [posts, isDescend, setPosts]);

  return (
    <div className={classes.sort} onClick={() => setIsDescend(!isDescend)}>
      <Arrow className={`${classes.icon} ${isDescend ? "" : classes.ascend}`} />
      <span className={classes.name}>Date</span>
    </div>
  );
}
