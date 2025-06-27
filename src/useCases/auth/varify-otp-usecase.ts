import { inject, injectable } from "tsyringe";
import { IVerifyOtpEmailUseCase } from "../../domain/interface/useCaseInterface/auth/verify-otp-usercase.interface";
import { IOtpService } from "../../domain/interface/servicesInterface/otp-service.interface";
import { error } from "console";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";




@injectable()
export class VarifyOtpUseCase implements IVerifyOtpEmailUseCase{
     constructor(
      @inject("IOtpService")
      private _otpService : IOtpService

     ) {}

     async execute(email: string, otp: string): Promise<boolean> {
         console.log('working');
         
       const result = await this._otpService.varifyOtp(email,otp)
       if (result === "invalid") {
        throw new CustomError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
      }
    
      if (result === "expired") {
        throw new CustomError(ERROR_MESSAGES.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST);
      }
    
        return true
       }
     }   
