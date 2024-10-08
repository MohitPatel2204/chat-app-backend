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
      console.log("🚀 Error is : ", error);
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
      upload(request, response, (error) => {
        if (error) {
          generateResponse(response, null, error);
        } else {
          if (filesOptions.isMultiple) {
            request.body[filesOptions.name] = (
              request.files as Express.Multer.File[]
            )
              .map((file) => file.path.replace("public/", ""))
              .join(", ");
          } else {
            request.body[filesOptions.name] = request.file?.path.replace(
              "public/",
              ""
            );
          }
          next();
        }
      });
    } catch (error) {
      generateResponse(response, null, error);
    }
  };
};

export default fileUpload;
