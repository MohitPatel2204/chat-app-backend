import Joi from "joi";
import { NextFunction, Response, Request } from "express";
import generateResponse from "../utils/functions";

export const validFormData = (schema: Joi.ObjectSchema<unknown>) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    let data: Record<string, unknown> = {};
    switch (request.method) {
      case "POST":
      case "PUT":
        data = request.body;
        break;
      default:
        if (request.query) {
          data = request.query;
        } else {
          data = request.params;
        }
    }

    const { error } = await schema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      return generateResponse(response, {
        status: 400,
        message: "Invalid request data",
        data: error,
        totalCount: 1,
        toast: false,
        success: false,
      });
    } else {
      return next();
    }
  };
};
