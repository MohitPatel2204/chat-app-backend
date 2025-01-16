"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("otps", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "user_details",
        key: "id",
      },
    },
    otp: {
      type: Sequelize.STRING,
    },
    expiresAt: {
      type: Sequelize.DATE,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface) {
  await queryInterface.dropTable("otps");
}
