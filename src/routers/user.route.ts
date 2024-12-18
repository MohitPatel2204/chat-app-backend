import express from "express";
import UserController from "../controllers/user.controller";
import authenticate from "../middlewares/auth.middleware";
import fileUpload from "../middlewares/file.middleware";
import { imageFormat, PROFILE_PATH } from "../utils/constant";
import { validFormData } from "../middlewares/validateForm";
import { registerSchema } from "../schemas/auth.schema";

export default class UserRoutes {
  public path = "/user";
  public router = express.Router();
  private userController = new UserController();

  constructor() {
    this.initializeRoutes();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}`, authenticate, this.userController.getUser);
    this.router.get(`${this.path}/search`, this.userController.getUserBySearch);

    this.router.put(
      `${this.path}/:id`,
      authenticate,
      fileUpload({
        isMultiple: false,
        name: "image",
        path: PROFILE_PATH,
        type: imageFormat,
        size: 10000000,
      }),
      validFormData(registerSchema),
      this.userController.updateUser
    );
  };
}
