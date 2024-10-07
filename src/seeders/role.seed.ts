import db from "../models";
import Role from "../models/role";
const roles = [{ name: "admin" }, { name: "user" }];

const createRole = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    db.connect;
    roles.forEach(async (role) => {
      const existingRole = await Role.findAll({
        where: {
          name: role.name,
        },
      });

      if (!existingRole) {
        await Role.create(role);
      }
    });
    console.log("🚀 Role seeder successfully completed");
  } catch (error) {
    console.log("🚀 ERROR : ", (error as Error)?.message);
  }
};

createRole();
