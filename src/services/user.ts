import { Op } from "sequelize";
import userT from "../interfaces/models/userT";
import OTP from "../database/models/otp";
import User from "../database/models/user";
import { emailSubject, QUEUE_LIST } from "../utils/constant";
import { deleteFiles, generateOtp, getHashPassword } from "../utils/functions";
import RoleService from "./role";
import path from "path";
import queue from "./queue";

export default class UserService {
  private readonly roleService;

  constructor() {
    this.roleService = new RoleService();
  }

  public createUser = async (user: userT, roleName: string) => {
    const existUser = await User.findOne({
      where: {
        email: user.email,
        mobileNo: user.mobileNo,
        isDeleted: false,
      },
    });

    if (existUser) {
      throw new Error(`${user.email} is already exist`);
    }

    const role = await this.roleService.roleByName(roleName);
    if (!role) {
      throw new Error(`Role ${roleName} is not found`);
    }

    const createdUser = await User.create({
      ...user,
      roleId: role.id,
      password: getHashPassword(user?.password || ""),
    });

    const otp = generateOtp(6);
    await OTP.create({
      expiresAt: new Date(),
      otp,
      userId: createdUser.id,
      user: createdUser,
    });

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
    {
      email,
      firstName,
      lastName,
      id,
      username,
    }: {
      email?: string;
      firstName?: string;
      lastName?: string;
      id?: string;
      username?: string;
    },
    pageSize?: number,
    pageNumber?: number
  ) => {
    const query = [
      firstName ? { firstName: { [Op.like]: `%${firstName}%` } } : null,
      lastName ? { lastName: { [Op.like]: `%${lastName}%` } } : null,
      username ? { username: { [Op.like]: `%${username}%` } } : null,
      email ? { email: { [Op.like]: `%${email}%` } } : null,
      id ? { id } : null,
    ].filter((item) => item !== null);

    const users = await User.findAll({
      where: {
        ...(query.length > 0 ? { [Op.or]: [...query] } : null),
        isDeleted: false,
      },
      limit: pageSize ?? 10,
      offset: (pageNumber ?? 0) * (pageSize ?? 10),
      attributes: {
        exclude: ["password"],
      },
    });

    const totalUser = await User.findAndCountAll({
      where: {
        ...(query.length > 0 ? { [Op.or]: [...query] } : null),
        isDeleted: false,
      },
    });

    if (users && users.length > 0) {
      return {
        data: users,
        totalCount: totalUser?.count,
        message: `Total ${totalUser.count} users fetched.`,
      };
    }
    throw new Error("User is not found...");
  };

  public updateUser = async (userId: string, user: userT) => {
    const oldUser = await this.getUsersBySearch({ id: userId });
    if (oldUser && oldUser.data[0].id.toString() === userId) {
      if (user?.image && oldUser.data[0].image !== user.image) {
        deleteFiles(path.join("public", oldUser.data[0].image));
      }
      const updatedUser = await User.update(
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
          where: {
            id: userId,
          },
        }
      );
      if (updatedUser.pop()) {
        const newUser = await this.getUsersBySearch({ id: userId });
        return {
          data: newUser.data[0].dataValues,
          message: `${newUser.data[0].dataValues.firstName} ${newUser.data[0].dataValues.lastName} is successfully updated`,
        };
      }
      throw new Error("Sorry, User profile is not updated");
    }
    throw new Error("User is not found");
  };
}
