import { Column, DataType, HasMany, Table, Model } from "sequelize-typescript";
import roleT from "../../interfaces/models/roleT";
import User from "./user";

@Table({
  tableName: "roles",
  timestamps: true,
})
export default class Role extends Model<roleT> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  name!: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDeleted!: boolean;

  @HasMany(() => User)
  users!: User[];
}
