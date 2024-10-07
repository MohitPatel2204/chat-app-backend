// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
require("dotenv").config();

// eslint-disable-next-line no-undef
const { DB_TYPE, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// eslint-disable-next-line no-undef
module.exports = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: DB_TYPE,
};
