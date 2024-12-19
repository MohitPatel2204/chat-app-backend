import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";

const log = (request: Request, response: Response, next: NextFunction) => {
  logger.info(
    `🚀 ${request.method} ${request.url} host: ${request.headers.host} origin: ${request.headers.origin} ${request.headers["user-agent"]}`
  );
  next();
};

export default log;
