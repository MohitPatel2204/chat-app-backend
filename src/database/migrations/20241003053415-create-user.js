"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable(
    "user_details",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other"),
        defaultValue: "male",
      },
      mobileNo: {
        type: Sequelize.STRING,
      },
      dob: {
        type: Sequelize.DATE,
      },
      username: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "roles",
          key: "id",
        },
      },
    },
    {
      indexes: [
        {
          name: "mobileNo_email_unique",
          unique: true,
          using: "BTREE",
          fields: [{ name: "mobileNo" }, { name: "email" }],
        },
      ],
    }
  );
}
export async function down(queryInterface) {
  await queryInterface.dropTable("user_details");
}
