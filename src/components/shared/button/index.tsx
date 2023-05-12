import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from "react";
import classes from "./button.module.scss";

function StyledButton({
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button {...props} className={`${classes.button} ${props.className}`}>
      {children}
    </button>
  );
}

export default StyledButton;
