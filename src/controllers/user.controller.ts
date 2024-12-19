import { Request, Response } from "express";
import UserService from "../services/user";
import { generateResponse } from "../utils/functions";
import { logger } from "../config/logger";

export default class UserController {
  private readonly userService;
  constructor() {
    this.userService = new UserService();
  }

  public getUser = (request: Request, response: Response) => {
    try {
      if (request.user) {
        generateResponse(response, {
          success: true,
          toast: false,
          message: "User is available",
          data: request.user,
        });
      } else {
        generateResponse(response, {
          status: 501,
          message: "User is Unauthorized",
          toast: true,
          success: false,
        });
      }
    } catch (error) {
      generateResponse(response, null, error);
    }
  };

  public getUserBySearch = async (request: Request, response: Response) => {
    try {
      const pageSize = Number(request?.query?.pageSize ?? "10");
      const pageNumber = Number(request?.query?.pageNumber ?? "0");
      const {
        email,
        firstName,
        lastName,
        id,
        username,
      }: Record<string, string | undefined> = request.query as Record<
        string,
        string | undefined
      >;
      const result = await this.userService.getUsersBySearch(
        { email, firstName, lastName, id, username },
        pageSize,
        pageNumber
      );
      generateResponse(response, { ...result, toast: false, success: true });
    } catch (error) {
      logger.error(`🚀 Error: ${(error as Error).message}`);
      generateResponse(response, null, error);
    }
  };

  public updateUser = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { body } = request;
      const data = await this.userService.updateUser(id, body);
      generateResponse(response, { ...data, success: true, toast: true });
    } catch (error) {
      generateResponse(response, null, error);
    }
  };
}
