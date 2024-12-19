import { logger } from "../../config/logger";
import db from "../models";
import Role from "../models/role";

const createRole = async () => {
  db.connect();
  const roles = [{ name: "admin" }, { name: "user" }];
  try {
    for (const role of roles) {
      const existingRole = await Role.findOne({ where: { name: role.name } });
      if (!existingRole) {
        await Role.create(role);
      }
    }
  } catch (error) {
    throw new Error((error as Error)?.message);
  }
};

logger.info("🚀 Role seeder running...");
createRole()
  .then(() => {
    logger.info("🚀 Role seeder successfully completed");
    process.exit(0);
  })
  .catch((error) => {
    logger.error(`🚀 Error: ${(error as Error).message}`);
    process.exit(0);
  });
