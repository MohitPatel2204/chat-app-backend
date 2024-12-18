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
      console.log("🚀 Error : ", (error as Error).message);
      return null;
    }
  };
}
