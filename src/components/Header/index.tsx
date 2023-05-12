import React, { PropsWithChildren } from "react";
import classes from "./header.module.scss";
import Theme from "assets/actions/theme.svg";
import { useTheme } from "next-themes";

type HeaderProps = {
  home: string;
  title?: string;
  homeLink?: string;
};

function Header({
  title,
  home,
  homeLink,
  children,
}: PropsWithChildren<HeaderProps>) {
  const { theme, setTheme } = useTheme();
  return (
    <header className={classes.header}>
      <h1 className={classes.title}>
        <a href={homeLink ? homeLink : "/"}>{home}</a> / {title}
      </h1>
      <div className={classes.nav}>
        {children}
        <Theme
          className={classes.theme}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      </div>
    </header>
  );
}

export default Header;
