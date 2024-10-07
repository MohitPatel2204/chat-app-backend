import userT from "./userT";

export interface otpI {
  id?: number;
  userId: number;
  otp: string;
  expiresAt: Date | string;
  user?: userT;
}
