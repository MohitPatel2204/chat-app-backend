import { config } from "dotenv";
import { Dialect, Sequelize } from "sequelize";
config();

export const { HOST, PORT, DB_TYPE, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } =
  process.env;

export const sequelize = new Sequelize(
  DB_NAME as string,
  DB_TYPE as string,
  DB_PASSWORD as string,
  {
    host: DB_HOST as string,
    dialect: DB_TYPE as Dialect,
  }
);
