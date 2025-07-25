import { injectable } from "tsyringe";
import { IOtpEntity } from "../../../domain/entities/otp.entity";
import { IOtpRepositroy } from "../../../domain/interface/repositoryInterfaces/common-services/otp-service.repository";
import { otpModel } from "../../../frameworks/database/mongodb/model/otp.model";


@injectable()
export class OtpRepositroy implements IOtpRepositroy{
   
  async saveOtp(otp: IOtpEntity): Promise<void> {
      await otpModel.findOneAndUpdate(
        {email: otp.email},
        otp,
        {upsert:true}
      )
  }

 async findOtpByEmail(email: string): Promise<IOtpEntity | null> {
   const otpData = await otpModel.findOne({email})
   return otpData
 }

 async deleteOtp(email: string): Promise<void> {
   await otpModel.deleteOne({email})
 }

}