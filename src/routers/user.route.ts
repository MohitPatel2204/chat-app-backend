import express from "express";
import UserController from "../controllers/user.controller";

export default class UserRoutes {
  public path = "/user";
  public router = express.Router();
  private userController = new UserController();

  constructor() {
    this.initializeRoutes();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}`, this.userController.getUserBySearch);
  };
}
