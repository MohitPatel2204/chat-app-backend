import { SALT_ROUND } from "../config";
import userT from "../interfaces/models/userT";
import OTP from "../models/otp";
import User from "../models/user";
import { emailSubject } from "../utils/consatnt";
import { generateOtp, generateTemplate, sendEmail } from "../utils/functions";
import RoleService from "./role";
import bcrypt from "bcrypt";

export default class UserService {
  private roleService;

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

    const saltRound = bcrypt.genSaltSync(Number(SALT_ROUND));
    const password = bcrypt.hashSync(user.password, saltRound);

    const createdUser = await User.create({
      ...user,
      roleId: role.id,
      password,
    });

    const otp = generateOtp(6);
    await OTP.create({
      expiresAt: new Date().toLocaleString(),
      otp,
      userId: createdUser.id,
      user: createdUser,
    });
    sendEmail(
      createdUser.email,
      emailSubject.ACTIVATE_ACCOUNT,
      generateTemplate("./src/templates/otp.ejs", {
        otp,
        user: {
          name: `${createdUser.firstName} ${createdUser.lastName}`,
        },
      }) ?? ""
    );
    return {
      success: true,
      message: `User is successfully created, Please check email, and activate account`,
      data: createdUser.dataValues,
    };
  };
}
