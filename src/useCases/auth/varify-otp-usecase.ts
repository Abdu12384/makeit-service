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
         
       const isOtpValid = await this._otpService.varifyOtp(email,otp)
       console.log('isvalide',isOtpValid)

        if(!isOtpValid){
          throw new CustomError(ERROR_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST)
        }

        return true
       } 
     }   
