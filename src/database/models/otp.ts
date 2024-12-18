// models/otp.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./user";
import { otpI } from "../../interfaces/models/otpT";

@Table({
  tableName: "otps",
  timestamps: true,
})
class OTP extends Model<otpI> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  userId!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  otp!: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  expiresAt!: Date;

  @BelongsTo(() => User)
  user!: User;
}

export default OTP;
