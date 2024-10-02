import { NextFunction, Request, Response } from "express";

class AuthenticationController {
  public login = (request: Request, response: Response) => {
    response.send({ data: "hjgdjfgjh" });
  };
}

export default AuthenticationController;
