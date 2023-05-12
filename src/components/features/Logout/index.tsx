import React from "react";
import LogoutIcon from "assets/actions/logout.svg";
import classes from "./logout.module.scss";
import { signOut } from "next-auth/react";

export default function Logout() {
  return <LogoutIcon className={classes.logout} onClick={() => signOut()} />;
}
