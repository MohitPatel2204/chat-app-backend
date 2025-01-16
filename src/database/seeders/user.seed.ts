import { logger } from "../../config/logger";
import { users } from "../../utils/data";
import { getHashPassword } from "../../utils/functions";
import db from "../models";
import Role from "../models/role";
import User from "../models/user";

const existUser = async (username: string, email: string) => {
  return await User.findOne({ where: { username, email } });
};

const createUsers = async () => {
  db.connect();
  try {
    const roles = await Role.findAll();

    for (const role of roles) {
      logger.info(`🚀 ${role.name} role users seeding start...`);
      const data = users[role.name as keyof typeof users];
      for (const user of data) {
        if (!(await existUser(user.username, user.email))) {
          await User.create({
            ...user,
            gender: user.gender.toLocaleLowerCase() as unknown as "male",
            roleId: role.id,
            isActive: true,
            password: getHashPassword(user.password),
          });
        }
      }
      logger.info(`🚀 ${role.name} role users seeding complete...`);
    }
  } catch (error) {
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
