import fs from "fs";
import path from "path";

export function findFile(dirPath: string, name: string) {
  const matchedFiles = [];

  for (const file of fs.readdirSync(
    path.resolve(path.join(process.cwd(), dirPath))
  )) {
    const filename = path.parse(file).name;

    if (filename === name) {
      matchedFiles.push(
        path.join(path.resolve(path.join(process.cwd(), dirPath)), file)
      );
    }
  }

  if (matchedFiles.length) {
    return matchedFiles[0];
  } else {
    return null;
  }
}
