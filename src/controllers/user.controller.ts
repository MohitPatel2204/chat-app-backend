import { Request, Response } from "express";
import UserService from "../services/user";
import { generateResponse } from "../utils/functions";

export default class UserController {
  private userService;
  constructor() {
    this.userService = new UserService();
  }

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
      console.log(pageNumber, pageSize);
      const result = await this.userService.getUsersBySearch(
        { email, firstName, lastName, id, username },
        pageSize,
        pageNumber
      );
      console.log(
        "🚀 ~ file: user.controller.ts:22 ~ UserController ~ getUserBuSearch= ~ result:",
        result
      );
      generateResponse(response, { ...result, toast: false, success: true });
    } catch (error) {
      console.log("🚀 Error : ", (error as Error).message);
      generateResponse(response, null, error);
    }
  };
}
