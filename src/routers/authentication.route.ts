import express from "express";
import AuthenticationController from "../controllers/authentication.controller";
import { validFormData } from "../middlewares/validateForm";
import { registerSchema } from "../schemas/auth.schema";
import fileUpload from "../middlewares/file.middleware";
import { imageFormat, PROFILE_PATH } from "../utils/consatnt";

export default class AuthenticationRoutes {
  public path = "/auth";
  public router = express.Router();
  public authenticationController = new AuthenticationController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/login`, this.authenticationController.login);
    this.router.post(
      `${this.path}/register`,
      fileUpload({
        isMultiple: false,
        name: "image",
        path: PROFILE_PATH,
        type: imageFormat,
        size: 10000000,
      }),
      validFormData(registerSchema),
      this.authenticationController.register
    );
  }
}
