import { Op } from "sequelize";
import { OTP_EXPIRE_TIME } from "../config";
import OTP from "../models/otp";
import User from "../models/user";
import { emailSubject } from "../utils/constant";
import bcrypt from "bcrypt";

import {
  generateOtp,
  generateTemplate,
  getTimeDifference,
  getToken,
  sendEmail,
} from "../utils/functions";

export default class AuthenticateService {
  public activateAccount = async (email: string, otp: string) => {
    const otpResult = await OTP.findOne({
      include: [
        {
          model: User,
          where: { email },
        },
      ],
      where: { otp },
      order: [["createdAt", "DESC"]],
    });

    if (!otpResult) {
      throw new Error("OTP is invalid");
    }

    const diff = getTimeDifference(
      new Date().toLocaleString(),
      otpResult.createdAt.toLocaleString(),
      "minutes"
    );
    if (diff > Number(OTP_EXPIRE_TIME ?? "15")) {
      throw new Error("Activation code is expired");
    }

    await User.update(
      { isActive: true },
      {
        where: {
          id: otpResult.user.id,
        },
      }
    );

    return {
      message: "User is activate",
      data: otpResult.dataValues.user,
      token: getToken({ id: otpResult?.dataValues?.user?.id }),
    };
  };

  public sendOtp = async (email: string) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User is not exist");
    }

    const otp = generateOtp(6);
    await OTP.create({
      expiresAt: new Date().toLocaleString(),
      otp,
      userId: user.id,
      user: user,
    });

    sendEmail(
      user.email,
      emailSubject.ACTIVATE_ACCOUNT,
      generateTemplate("./src/templates/otp.ejs", {
        otp,
        user: {
          name: `${user.firstName} ${user.lastName}`,
        },
      }) ?? ""
    );

    return {
      message: "OTP is send successfully",
      success: true,
    };
  };

  public login = async (email: string, password: string) => {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username: email }],
        isDeleted: false,
      },
    });
    if (
      !user ||
      !bcrypt.compareSync(password, user.dataValues.password as string)
    ) {
      throw new Error("Username and password is invalid");
    }

    if (!user.dataValues.isActive) {
      throw new Error("Your account is not active");
    }

    delete user.dataValues.password;
    return {
      message: "Login successfully",
      data: user.dataValues,
      token: getToken({ id: user.dataValues.id }),
      success: true,
    };
  };
}
