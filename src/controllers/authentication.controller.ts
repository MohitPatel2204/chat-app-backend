import { Request, Response } from "express";
import { generateResponse } from "../utils/functions";
import UserService from "../services/user";
import AuthenticateService from "../services/authenticate";

class AuthenticationController {
  private userService;
  private authService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthenticateService();
  }

  public login = async (request: Request, response: Response) => {
    try {
      const { username, password } = request.body;
      const result = await this.authService.login(username, password);
      generateResponse(response, { ...result, toast: true });
    } catch (error) {
      generateResponse(response, null, error);
    }
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

  public activateAccount = async (request: Request, response: Response) => {
    try {
      const email: string = request.body.email;
      const otp: string = request.body.otp;
      const result = await this.authService.activateAccount(email, otp);
      generateResponse(response, { ...result, success: true, toast: true });
    } catch (error) {
      generateResponse(response, null, error);
    }
  };

  public sendOtp = async (request: Request, response: Response) => {
    try {
      const email: string = request.query.email as string;
      const result = await this.authService.sendOtp(email);
      generateResponse(response, { ...result, toast: true });
    } catch (error) {
      generateResponse(response, null, error);
    }
  };
}

export default AuthenticationController;
