import formidable from "formidable";
import fs from "fs";
import path from "path";

export function deleteFile(file: formidable.File, name?: string) {
  fs.unlinkSync(
    name
      ? path.join(
          path.dirname(file.filepath),
          name + "." + file.originalFilename?.split(".").pop()
        )
      : file.filepath
  );
}
