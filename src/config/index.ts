import { config } from "dotenv";
config();

export const { HOST, PORT, DB_TYPE, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } =
  process.env;
