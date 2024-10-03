import { DataTypes } from "sequelize";
import { sequelize } from "../config";
export const GENDER = ["male", "female", "other"];

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "roles",
    timestamps: true,
  }
);

export default Role;
