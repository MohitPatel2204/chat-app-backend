/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DataTypes } = require("sequelize");

const up = async (queryInterface) => {
  await queryInterface.createTable(
    "user_details",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        defaultValue: "male",
      },
      mobileNo: {
        type: DataTypes.STRING,
      },
      dob: {
        type: DataTypes.DATE,
      },
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      roleId: {
        type: DataTypes.INTEGER,
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
};

const down = async (queryInterface) => {
  await queryInterface.dropTable("user_details");
};

module.exports = { up, down };
