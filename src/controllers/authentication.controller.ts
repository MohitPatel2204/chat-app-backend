import { Request, Response } from "express";
import { generateResponse } from "../utils/functions";
import UserService from "../services/user";

class AuthenticationController {
  public userService;

  constructor() {
    this.userService = new UserService();
  }

  public login = (request: Request, response: Response) => {
    response.send({ data: "login" });
  };

  public register = async (request: Request, response: Response) => {
    try {
      const result = await this.userService.createUser(
        {
          firstName: request?.body?.firstName,
          lastName: request?.body?.lastName,
          email: request?.body?.email,
          password: request?.body?.password,
          gender: request?.body?.gender,
          username: request?.body?.username,
          mobileNo: request?.body?.mobileNo,
          image: request?.body?.image ?? null,
          dob: request?.body?.dob,
        },
        "user"
      );
      generateResponse(response, { ...result, toast: true });
    } catch (error) {
      generateResponse(response, null, error);
    }
  };
}

export default AuthenticationController;
