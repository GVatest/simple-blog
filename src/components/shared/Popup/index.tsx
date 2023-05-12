import React, { PropsWithChildren } from "react";
import CloseIcon from "assets/actions/delete.svg";
import classes from "./popup.module.scss";

interface PopupProps {
  title: string;
  onClose: () => void;
}

const Popup = ({ title, onClose, children }: PropsWithChildren<PopupProps>) => {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.popup}>
        <CloseIcon className={classes.close} onClick={onClose} />
        <h1 className={classes.title}>{title}</h1>
        {children}
      </div>
      <div className={classes.backdrop} onClick={handleBackdropClick} />
    </div>
  );
};

export default Popup;
