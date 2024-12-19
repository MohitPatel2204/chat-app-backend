import fs from "fs";
import path from "path";

import { ModelCtor } from "sequelize-typescript";
import { sequelize } from "../../config";
import { logger } from "../../config/logger";

const initSequelize = () => {
  const _basename = path.basename(module.filename);
  sequelize.authenticate().catch((err) => {
    logger.error(`Something went wrong ${err.message}`);
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
  connect: initSequelize,
};
export default db;
