import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import userT, { genderT } from "../interfaces/models/userT";
import { genderEnum } from "../utils/consatnt";
import Role from "./role";
import OTP from "./otp";

@Table({
  tableName: "user_details",
  timestamps: true,
})
export default class User extends Model<userT> {
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
  firstName!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  lastName!: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...genderEnum),
  })
  gender!: genderT;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  email!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  password!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  mobileNo!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  username!: string;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  dob!: Date | string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  image!: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isActive!: boolean;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDeleted!: boolean;

  @ForeignKey(() => Role)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @HasMany(() => OTP)
  otp!: OTP[];
}
