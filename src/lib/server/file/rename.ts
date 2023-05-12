import formidable from "formidable";
import fs from "fs";
import path from "path";

export function renameFile(file: formidable.File | string, name: string) {
  fs.renameSync(
    typeof file !== "string" ? file.filepath : file,
    path.join(
      path.dirname(typeof file !== "string" ? file.filepath : file),
      name +
        "." +
        (typeof file !== "string"
          ? file.originalFilename?.split(".").pop()
          : file.split(".").pop())
    )
  );
}
