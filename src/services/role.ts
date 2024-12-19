import { logger } from "../config/logger";
import Role from "../database/models/role";

export default class RoleService {
  public roleByName = async (name: string) => {
    try {
      return await Role.findOne({
        where: {
          name: name,
        },
      });
    } catch (error) {
      logger.error(`🚀 Error: ${(error as Error).message}`);
      return null;
    }
  };
}
