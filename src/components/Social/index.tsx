import React from "react";
import GoogleDrive from "assets/social/drive.svg";
import Github from "assets/social/github.svg";
import Telegram from "assets/social/telegram.svg";
import classes from "./social.module.scss";
import Link from "next/link";

function Social() {
  return (
    <div className={classes.social}>
      <Link target="_blank" href='https://drive.google.com/file/d/1MVwc4lWW8KQCT3Ixowh9jETajK_qqC3K/view?usp=share_link'>
        <GoogleDrive className={classes.icon} />
      </Link>
      <Link target="_blank" href='https://github.com/GVatest'>
        <Github className={classes.icon} />
      </Link>
      <Link target="_blank" href='https://t.me/gvatest'>
        <Telegram className={classes.icon} />
      </Link>
    </div>
  );
}

export default Social;
