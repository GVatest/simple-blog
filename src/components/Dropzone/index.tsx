import classes from "./dropzone.module.scss";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";
import { VALID_FILE_FORMATS } from "constants/locales";
import { StyledButton } from "components/shared";

type DropzoneProps = {
  setNewFile: (value: globalThis.File) => void;
};

const acceptFormats = {
  "html/text": VALID_FILE_FORMATS.map((format) => "." + format),
};

export default function Dropzone({ setNewFile }: DropzoneProps) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: acceptFormats,
  });

  useEffect(() => {
    setNewFile(acceptedFiles[0]);
  }, [acceptedFiles, setNewFile]);

  return (
    <>
      <div {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps({ multiple: false })} />
        <p className={classes.dropzone__text}>Drag and drop file here</p>
        <StyledButton type='button' className={classes.dropzone__btn}>
          Choose file
        </StyledButton>
        <div className={classes.dropzone__files}>
          {acceptedFiles.map((file, i) => (
            <span key={i}>
              {file.name} - {file.size} bytes
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
