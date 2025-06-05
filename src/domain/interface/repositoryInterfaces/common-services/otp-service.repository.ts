import { IOtpEntity } from "../../../entities/otp.entity";

export interface IOtpRepositroy{
  saveOtp(otp: IOtpEntity): Promise<void>;
  findOtpByEmail(email:string):Promise<IOtpEntity|null>
  deleteOtp(email:string): Promise<void>
}