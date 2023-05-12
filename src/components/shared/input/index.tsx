import React from "react";
import classes from "./input.module.scss";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type Ref = HTMLInputElement;

const StyledInput = React.forwardRef<Ref, InputProps>(function Input(
  props,
  ref
) {
  return (
    <input
      ref={ref}
      {...props}
      className={`${classes.input} ${props.className}`}
    />
  );
});

export default StyledInput;
