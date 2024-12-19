import { config } from "dotenv";
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
config();

export const {
  HOST,
  PORT,
  DB_TYPE,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
  SALT_ROUND,
  OTP_EXPIRE_TIME,
  JWT_SECRET_KEY,
  LOG_DIR,
} = process.env;

export const sequelize = new Sequelize(
  DB_NAME as string,
  DB_USER as string,
  DB_PASSWORD as string,
  {
    host: DB_HOST as string,
    dialect: DB_TYPE as Dialect,
    logging: false,
  }
);
