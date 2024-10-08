import { Response } from "express";
import responseT from "../interfaces/Response.interface";
import nodemailer from "nodemailer";
import { MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from "../config";
import ejs from "ejs";
import moment from "moment";

export const generateResponse = (
  response: Response,
  params: {
    message: string;
    success: boolean;
    toast: boolean;
    status?: number;
    data?: unknown;
    totalCount?: number;
    token?: string;
  } | null,
  error?: unknown
): Response => {
  if (error) {
    console.log("🚀 Error: ", (error as Error).message);
  }
  if (params) {
    const status = params.status ?? params.success ? 200 : 400;
    return response.status(status).json({
      success: params.success,
      data: params.data
        ? {
            data: params.data,
            totalCount: params.totalCount ?? 1,
          }
        : undefined,
      message: params.message,
      status: status,
      token: params.token,
      toast: params.toast,
    } as responseT);
  } else {
    return response.status(500).json({
      status: 500,
      message: (error as Error).message,
      success: false,
      toast: true,
    });
  }
};

export const generateOtp = (length: number) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

export const sendEmail = async (
  to: string,
  subject: string,
  message: string
): Promise<{ message: string; isValid: boolean }> => {
  try {
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: Number(MAIL_PORT),
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });

    const mailOPtion = {
      from: MAIL_USER,
      to,
      subject,
      html: message,
    };

    const result = await transporter.sendMail(mailOPtion);
    console.log("🚀 ~ Email is fired : ", result);
    if (result.accepted) {
      return { message: "Email sent successfully", isValid: true };
    } else {
      return { message: "Something is wrong...", isValid: false };
    }
  } catch (error) {
    return {
      message: (error as Error).message,
      isValid: false,
    };
  }
};

export const generateTemplate = (
  fileName: string,
  data: Record<string, unknown> = {}
) => {
  const templateContent = ejs.fileLoader(fileName);
  if (templateContent) {
    const template = templateContent.toString();
    const html = ejs.render(template, data);
    return html;
  }
  return null;
};

export const getTimeDifference = (
  time1: string,
  time2: string,
  type:
    | "years"
    | "months"
    | "weeks"
    | "days"
    | "hours"
    | "minutes"
    | "seconds" = "hours"
): number => {
  const momentTime1 = moment(time1, "MM/DD/YYYY, hh:mm:ss a");
  const momentTime2 = moment(time2, "MM/DD/YYYY, hh:mm:ss a");
  return momentTime1.diff(momentTime2, type);
};
