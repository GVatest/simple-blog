import React, { HTMLAttributes, PropsWithChildren } from "react";
import classes from "./layout.module.scss";

function Layout({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={classes.layout} {...props}>
      {children}
    </div>
  );
}

export default Layout;
