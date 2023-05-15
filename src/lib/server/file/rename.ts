import formidable from "formidable";
import fs from "fs";
import path from "path";

export function renameFile(file: formidable.File | string, name: string) {
  const filePath = typeof file !== "string" ? file.filepath : file;
  fs.renameSync(
    filePath,
    path.join(
      path.dirname(filePath),
      name +
        "." +
        (typeof file !== "string"
          ? file.originalFilename?.split(".").pop()
          : file.split(".").pop())
    )
  );
}
