import { Transaction } from "sequelize";
import { logger } from "../config/logger";
import Role from "../database/models/role";

export default class RoleService {
  public roleByName = async (name: string, transaction: Transaction | null) => {
    try {
      return await Role.findOne({
        where: {
          name: name,
        },
        transaction,
      });
    } catch (error) {
      logger.error(`🚀 Error: ${(error as Error).message}`);
      return null;
    }
  };
}
