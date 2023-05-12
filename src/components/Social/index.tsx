import React from "react";
import GoogleDrive from "assets/social/drive.svg";
import Github from "assets/social/github.svg";
import Telegram from "assets/social/telegram.svg";
import classes from "./social.module.scss";

function Social() {
  return (
    <div className={classes.social}>
      <GoogleDrive />
      <Github />
      <Telegram />
    </div>
  );
}

export default Social;
