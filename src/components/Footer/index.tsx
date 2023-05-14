import React from "react";
import classes from "./footer.module.scss";
import Social from "components/Social";

function Footer() {
  return (
    <footer className={classes.footer}>
      <Social />
    </footer>
  );
}

export default Footer;
