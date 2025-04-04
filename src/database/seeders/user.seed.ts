import { sequelize } from "../../config";
import { logger } from "../../config/logger";
import { users } from "../../utils/data";
import { getHashPassword } from "../../utils/functions";
import db from "../models";
import Role from "../models/role";
import User from "../models/user";

const createUsers = async () => {
  db.connect();
  const transaction = await sequelize.transaction();
  try {
    const roles = await Role.findAll({ transaction });

    for (const role of roles) {
      logger.info(`🚀 ${role.name} role users seeding start...`);
      const data = users[role.name as keyof typeof users];
      for (const user of data) {
        const existUserData = await User.findOne({
          where: {
            username: user.username,
            email: user.email,
          },
          transaction,
        });
        if (!existUserData) {
          await User.create(
            {
              ...user,
              gender: user.gender.toLocaleLowerCase() as unknown as "male",
              roleId: role.id,
              isActive: true,
              password: getHashPassword(user.password),
            },
            { transaction }
          );
        } else {
          await existUserData.update(
            {
              dob: user.dob,
              firstName: user.firstName,
              lastName: user.lastName,
              mobileNo: user.mobileNo,
              gender: user.gender.toLocaleLowerCase() as unknown as "male",
              roleId: role.id,
              isActive: true,
              password: getHashPassword(user.password),
            },
            { transaction }
          );
        }
      }
      logger.info(`🚀 ${role.name} role users seeding complete...`);
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error((error as Error)?.message);
  }
};

logger.info("🚀 Users seeder running...");
createUsers()
  .then(() => {
    logger.info("🚀 Users seeder successfully completed");
    process.exit(0);
  })
  .catch((error) => {
    logger.error(`🚀 Error: ${(error as Error).message}`);
    process.exit(0);
  });
