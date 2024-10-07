import fs from "fs";
import path from "path";

import { ModelCtor, Sequelize } from "sequelize-typescript";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_TYPE, DB_USER } from "../config";
import { Dialect } from "sequelize";

const initSequelize = () => {
  const _basename = path.basename(module.filename);
  const sequelize = new Sequelize(
    DB_NAME as string,
    DB_USER as string,
    DB_PASSWORD as string,
    {
      host: DB_HOST as string,
      dialect: DB_TYPE as Dialect,
      logging: true,
    }
  );
  sequelize
    .authenticate()
    .then(() => {
      console.log(`Successfully connected to database!`);
    })
    .catch((err) => {
      console.log(`Something went wrong ${err.message}`);
    });

  const _models = fs
    .readdirSync(__dirname)
    .filter((file: string) => {
      return (
        file !== _basename &&
        (file.slice(-3) === ".ts" || file.slice(-3) === ".js")
      );
    })
    .map((file: string) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const model: ModelCtor = require(path.join(__dirname, file))?.default;
      return model;
    });
  sequelize.addModels(_models);
  return sequelize;
};

const db = {
  connect: initSequelize(),
};
export default db;
