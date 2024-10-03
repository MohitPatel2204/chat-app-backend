import { Request, Response } from "express";

class AuthenticationController {
  public login = (request: Request, response: Response) => {
    response.send({ data: "login" });
  };

  public register = (request: Request, response: Response) => {
    response.send({ data: "register" });
  };
}

export default AuthenticationController;
