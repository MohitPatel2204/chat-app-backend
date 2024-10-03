import Role from "../models/role";
const roles = [{ name: "admin" }, { name: "user" }];

const createRole = () => {
  try {
    roles.forEach(async (role) => {
      const existingRole = await Role.findOne({
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
