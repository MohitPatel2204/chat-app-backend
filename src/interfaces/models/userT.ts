import Role from "../../models/role";

export type genderT = "male" | "female" | "other";

export default interface userT {
  id?: number;
  firstName: string;
  lastName: string;
  gender: genderT;
  email: string;
  password?: string;
  mobileNo: string;
  dob: Date | string;
  username: string;
  image?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  roleId?: number;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}
