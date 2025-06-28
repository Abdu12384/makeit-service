import { injectable,inject } from "tsyringe";
import { ISendOtpEmailUseCase } from "../../domain/interface/useCaseInterface/auth/sent-otp-usecase.interface";
import { IOtpService } from "../../domain/interface/servicesInterface/otp-service.interface";
import { IEmailService } from "../../domain/interface/servicesInterface/email.service.interface";
import { IUserExistenceService } from "../../domain/interface/servicesInterface/user-existence-service.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";


@injectable()
export class sendOtpEmailUseCase implements ISendOtpEmailUseCase{
   
    constructor(
      @inject("IOtpService")
      private _otpService: IOtpService,

      @inject("IEmailService")
      private _emailService: IEmailService,

      @inject("IUserExistenceService")
      private _userExitenceService: IUserExistenceService
    ) {}



    async execute(email: string): Promise<void> {

        const {exists} = await this._userExitenceService.findUserByEmail(email)

        if(exists){
            throw new CustomError(
               ERROR_MESSAGES.EMAIL_EXISTS,
               HTTP_STATUS.CONFLICT
            )
        }
        
        const otp =  this._otpService.generateOtp()

              
            
         await this._otpService.storeOtp(email, otp)
          
           await this._emailService.sendOtpEmail(
            email,
            "MAKEIT - Verify Your Email",
             otp
            )

    }
}