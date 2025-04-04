import { Op, Transaction } from "sequelize";
import userT from "../interfaces/models/userT";
import OTP from "../database/models/otp";
import User from "../database/models/user";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  emailSubject,
  QUEUE_LIST,
} from "../utils/constant";
import { deleteFiles, generateOtp, getHashPassword } from "../utils/functions";
import RoleService from "./role";
import path from "path";
import queue from "./queue";
import queryParameterT from "../interfaces/Query.interface";

export default class UserService {
  private readonly roleService;

  constructor() {
    this.roleService = new RoleService();
  }

  public createUser = async (
    user: userT,
    roleName: string,
    transaction: Transaction | null
  ) => {
    const existUser = await User.findOne({
      where: {
        email: user.email,
        mobileNo: user.mobileNo,
        isDeleted: false,
      },
      transaction,
    });

    if (existUser) {
      throw new Error(`${user.email} is already exist`);
    }

    const role = await this.roleService.roleByName(roleName, transaction);
    if (!role) {
      throw new Error(`Role ${roleName} is not found`);
    }

    const createdUser = await User.create(
      {
        ...user,
        roleId: role.id,
        password: getHashPassword(user?.password || ""),
      },
      { transaction }
    );

    const otp = generateOtp(6);
    await OTP.create(
      {
        expiresAt: new Date(),
        otp,
        userId: createdUser.id,
        user: createdUser,
      },
      { transaction }
    );

    const context = {
      otp,
      user: {
        name: `${createdUser.firstName} ${createdUser.lastName}`,
      },
    };

    await queue.sendMessage(QUEUE_LIST.SEND_EMAIL, {
      email: createdUser.email,
      subject: emailSubject.ACTIVATE_ACCOUNT,
      context,
      template: "otp.ejs",
    });

    return {
      success: true,
      message: `User is successfully created, Please check email, and activate account`,
      data: createdUser.dataValues,
    };
  };

  public getUsersBySearch = async (
    query: queryParameterT,
    transaction: Transaction | null
  ) => {
    const page = Number(query?.page ?? DEFAULT_PAGE);
    const limit = Number(query?.limit ?? DEFAULT_PAGE_SIZE);

    const { rows, count } = await User.findAndCountAll({
      where: {
        ...(query.filter
          ? {
              [Op.or]: [
                { $firstName$: { [Op.like]: `%${query.filter}%` } },
                { $lastName$: { [Op.like]: `%${query.filter}%` } },
                { $email$: { [Op.like]: `%${query.filter}%` } },
                { $gender$: { [Op.like]: `%${query.filter}%` } },
                { $username$: { [Op.like]: `%${query.filter}%` } },
              ],
            }
          : null),
        isDeleted: false,
      },
      attributes: {
        exclude: ["password"],
      },
      order: [
        [
          query?.sort ? query.sort : "updatedAt",
          query?.order ? query.order : "desc",
        ],
      ],
      limit,
      offset: (page - 1) * limit,
      transaction,
    });

    return {
      message: "Users are successfully retrieved",
      data: rows,
      totalCount: count,
      isNextPage: page * limit < count,
      page,
      limit,
      sort: query?.sort,
      order: query?.order,
    };
  };

  public getUserById = async (id: number, transaction: Transaction | null) => {
    const user = await User.findByPk(id, { transaction });
    if (!user) {
      throw new Error("User is not found...");
    }

    return {
      data: user,
      message: "User fetched successfully.",
    };
  };

  public updateUser = async (
    userId: number,
    user: userT,
    transaction: Transaction | null
  ) => {
    const existUser = await this.getUserById(userId, transaction);
    if (existUser) {
      if (user?.image && existUser.data.image !== user.image) {
        deleteFiles(path.join("public", existUser.data.image));
      }
      const updatedUser = await existUser.data.update(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          dob: user.dob,
          gender: user.gender,
          mobileNo: user.mobileNo,
          ...(user?.image ? { image: user.image } : null),
        },
        {
          transaction,
        }
      );
      return {
        data: updatedUser,
        message: "User updated successfully.",
      };
    }
    throw new Error("User is not found");
  };
}
