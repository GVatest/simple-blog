import React, { HTMLAttributes } from "react";
import classes from "./spinner.module.scss";

function Spinner({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}
    className={`${classes.wrapper} ${props.className}`}>
      <div className={classes.spinner}></div>
    </div>
  );
}

export default Spinner;
