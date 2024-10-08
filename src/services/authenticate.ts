import { OTP_EXPIRE_TIME } from "../config";
import OTP from "../models/otp";
import User from "../models/user";
import { getTimeDifference } from "../utils/functions";

export default class AuthenticateService {
  constructor() {}

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
    };
  };
}
