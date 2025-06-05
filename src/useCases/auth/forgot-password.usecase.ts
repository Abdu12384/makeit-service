import { inject, injectable } from "tsyringe";
import { IForgotPasswordUseCase } from "../../domain/interface/useCaseInterface/auth/forgot-password-usecase.interface.js";
import { IEmailService } from "../../domain/interface/servicesInterface/email.service.interface.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS, RESET_PASSWORD_MAIL_CONTENT } from "../../shared/constants.js";
import { IUserExistenceService } from "../../domain/interface/servicesInterface/user-existence-service.interface.js";
import { IGenerateTokenUseCase } from "../../domain/interface/useCaseInterface/auth/genarate-token-usecase.interface.js";
import { config } from "../../shared/config.js";











@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase{

   constructor(
    @inject("IUserExistenceService")
    private _userExitenceService : IUserExistenceService,

    @inject("IGenerateTokenUseCase")
    private _generateTokenUseCase : IGenerateTokenUseCase,

    @inject("IEmailService")
    private _emailService : IEmailService
   ) {}
   async execute(email:string): Promise<void> {
      
     const {exists, user} = await this._userExitenceService.findUserByEmail(email)
     
     console.log('user',user)
      if(!exists){
        throw new CustomError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        )
      }
    
      const token = await this._generateTokenUseCase.execute(
        user.userId as string,
        user.email,
        user.role
        )
    
        console.log('token',token)
     const resetLink = `${config.ORIGIN}/reset-password?token=${token.accessToken}`

     const subject = "Reset Password"

     const content = RESET_PASSWORD_MAIL_CONTENT(resetLink)

     await this._emailService.sendCustomEmail(email, subject, content)

     
   }
}