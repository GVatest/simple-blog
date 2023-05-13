import path from "path";
import fs from "fs";
import formidable from "formidable";
import { IncomingMessage } from "http";
import { VALID_FILE_FORMATS } from "constants/locales";
import { deleteFile } from "./file/delete";
import { couldStartTrivia } from "typescript";

function validateFile(file: formidable.File | formidable.File[]) {
  if (!file) return undefined;

  if (Array.isArray(file)) {
    file.forEach((file) => deleteFile(file));
    throw new Error("Unable to save multiple files");
  }

  if (!file.originalFilename?.split(".").pop()) {
    deleteFile(file);
    throw new Error("Can't recorgize file format");
  } else if (
    VALID_FILE_FORMATS.indexOf(
      (file.originalFilename as string).split(".").pop()!
    ) < 0
  ) {
    deleteFile(file);
    throw new Error("Invalid file format");
  }

  return file;
}

export function parseForm(req: IncomingMessage, to: string, fileName?: string) {
  const uploadPath = path.resolve(path.join(process.cwd(), to));
  const options: formidable.Options = {};

  options.uploadDir = uploadPath;
  if (fileName) {
    options.filename = (name, ext, part) =>
      fileName + "." + part.originalFilename?.split(".").pop();
  }

  fs.readdir(uploadPath, (err) => {
    if (!err) return;
    fs.mkdir(uploadPath, (err) => {
      if (err) throw err;
    });
  });



  const form = formidable(options);

  const result = new Promise<[formidable.Fields, formidable.File | undefined]>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        }

        try {
          const validFile = validateFile(files.file);
          resolve([fields, validFile]);
        } catch (e) {
          reject((e as Error).message);
        }
      });
    }
  );

  return result;
}
