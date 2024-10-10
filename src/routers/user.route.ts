import express from "express";
import UserController from "../controllers/user.controller";
import authenticate from "../middlewares/auth.middleware";

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
  };
}
