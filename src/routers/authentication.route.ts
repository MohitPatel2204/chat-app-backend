import { Router } from "express";
import AuthenticationController from "../controllers/authentication.controller";

export default class AuthenticationRoutes {
  public path = "/auth";
  public router = Router();
  public authenticationController = new AuthenticationController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/login`, this.authenticationController.login);
    this.router.post(
      `${this.path}/register`,
      this.authenticationController.register
    );
  }
}
