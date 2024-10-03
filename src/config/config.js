require("dotenv").config();

const { DB_TYPE, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

module.exports = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: DB_TYPE,
};
