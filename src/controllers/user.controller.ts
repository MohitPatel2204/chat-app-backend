import { Request, Response } from "express";
import UserService from "../services/user";
import { generateResponse } from "../utils/functions";
import { sequelize } from "../config";

export default class UserController {
  private readonly userService;
  constructor() {
    this.userService = new UserService();
  }

  public getUser = (request: Request, response: Response) => {
    try {
      if (request.user) {
        generateResponse(response, {
          success: true,
          toast: false,
          message: "User is available",
          data: request.user,
        });
      } else {
        generateResponse(response, {
          status: 501,
          message: "User is Unauthorized",
          toast: true,
          success: false,
        });
      }
    } catch (error) {
      generateResponse(response, null, error);
    }
  };

  public getUserBySearch = async (request: Request, response: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const result = await this.userService.getUsersBySearch(
        request.query,
        transaction
      );
      await transaction.commit();
      generateResponse(response, {
        ...result,
        toast: false,
        success: true,
      });
    } catch (error) {
      await transaction.rollback();
      generateResponse(response, null, error);
    }
  };

  public updateUser = async (request: Request, response: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = request.params;
      const { body } = request;
      const data = await this.userService.updateUser(
        Number(id),
        body,
        transaction
      );
      await transaction.commit();
      generateResponse(response, { ...data, success: true, toast: true });
    } catch (error) {
      await transaction.rollback();
      generateResponse(response, null, error);
    }
  };
}
