import { NextFunction, Request, Response } from "express";
import multer from "multer";
import * as fs from "fs";
import path from "path";
import { generateResponse } from "../utils/functions";

/**
 * name: request key
 * path: to store a file designation
 * type: file type allowed
 * size: file size allowed in KB
 */
type fileUploadOptions = {
  name: string;
  path: string;
  type: Array<string>;
  size: number;
  isMultiple: boolean;
};

const storage = (filesOptions: fileUploadOptions) => {
  console.log("🚀 2");
  return multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, cb) => {
      fs.mkdirSync(filesOptions.path, { recursive: true });
      cb(null, filesOptions.path);
    },
    filename: (request: Request, file: Express.Multer.File, cb) => {
      cb(null, Date.now().toString() + path.extname(file.originalname));
    },
  });
};

const filter = (filesOptions: fileUploadOptions) => {
  console.log("🚀 3");

  return (
    request: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    try {
      if (filesOptions.type.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(`ERROR: Only ${filesOptions.type.join(", ")} is allowed...`)
        );
      }
    } catch (error) {
      console.log("🚀 ERROR : ", (error as Error).message);
      cb(
        new Error(`ERROR: Only ${filesOptions.type.join(", ")} is allowed...`)
      );
    }
  };
};

const fileUpload = (filesOptions: fileUploadOptions) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      let upload;
      if (filesOptions.isMultiple) {
        upload = multer({
          storage: storage(filesOptions),
          fileFilter: filter(filesOptions),
          limits: {
            files: filesOptions.size * 1024, // Convert size from KB to bytes
          },
        }).array(filesOptions.name + "[]");
      } else {
        upload = multer({
          storage: storage(filesOptions),
          fileFilter: filter(filesOptions),
          limits: {
            files: filesOptions.size * 1024, // Convert size from KB to bytes
          },
        }).single(filesOptions.name + "[]");
      }
      console.log("🚀 4");

      upload(request, response, (error) => {
        if (error) {
          console.log(
            "🚀 ~ file: file.middleware.ts:84 ~ upload ~ error:",
            error
          );
          console.log("🚀 5");
          generateResponse(response, null, error);
        } else {
          console.log("🚀 6");
          if (filesOptions.isMultiple) {
            console.log("🚀 7");
            request.body[filesOptions.name] = (
              request.files as Express.Multer.File[]
            )
              .map((file) => file.path.replace("public/", ""))
              .join(", ");
            console.log("🚀 8");
          } else {
            request.body[filesOptions.name] = request.file?.path.replace(
              "public/",
              ""
            );
            console.log("🚀 9");
          }
          next();
          console.log("🚀 10");
        }
      });
    } catch (error) {
      console.log("🚀 ~ file: file.middleware.ts:108 ~ return ~ error:", error);
      generateResponse(response, null, error);
    }
  };
};

export default fileUpload;
