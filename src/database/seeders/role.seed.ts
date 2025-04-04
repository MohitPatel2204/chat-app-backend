import { sequelize } from "../../config";
import { logger } from "../../config/logger";
import { roles } from "../../utils/data";
import db from "../models";
import Role from "../models/role";

const createRole = async () => {
  db.connect();
  const transaction = await sequelize.transaction();
  try {
    for (const role of Object.values(roles)) {
      const existingRole = await Role.findOne({
        where: { name: role },
        transaction,
      });
      if (!existingRole) {
        await Role.create(
          {
            name: role,
          },
          { transaction }
        );
      }
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
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
