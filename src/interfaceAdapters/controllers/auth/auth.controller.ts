import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { IClientAuthController } from "../../../domain/interface/controllerInterfaces/auth/auth-controller.interface.js";
import { IRegisterUseCase } from "../../../domain/interface/useCaseInterface/auth/register.usecase.js";
import { IOtpService } from "../../../domain/interface/servicesInterface/otp-service.interface.js";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants.js";
import { ISendOtpEmailUseCase } from "../../../domain/interface/useCaseInterface/auth/sent-otp-usecase.interface.js";
import { IVerifyOtpEmailUseCase } from "../../../domain/interface/useCaseInterface/auth/verify-otp-usercase.interface.js";
import { handleErrorResponse } from "../../../shared/utils/error.handler.js";
import { userSchemas } from "../../../useCases/auth/validation/user-signup.validation.schema.js";
import { LoginUserDTO } from "../../../shared/dtos/user.dto.js";
import { loginSchema } from "../../../useCases/auth/validation/user-login.validation.schema.js";
import { ILoginUserUseCase } from "../../../domain/interface/useCaseInterface/auth/login.usecase.interface.js";
import { IGenerateTokenUseCase } from "../../../domain/interface/useCaseInterface/auth/genarate-token-usecase.interface.js";
import { clearAuthCookies, setAuthCookies, updateCookieWithAccessToken } from "../../../shared/utils/cookie.helper.js";
import { IGoogleUseCase } from "../../../domain/interface/useCaseInterface/auth/google-usecase.interface.js";
import { CustomRequest } from "../../middlewares/auth.middleware.js";
import { IRefreshTokenUseCase } from "../../../domain/interface/useCaseInterface/auth/refresh-token-usecase.interface.js";
import { IBlackListTokenUseCase } from "../../../domain/interface/useCaseInterface/auth/blacklist-token-usecase.interface.js";
import { IForgotPasswordUseCase } from "../../../domain/interface/useCaseInterface/auth/forgot-password-usecase.interface.js";
import { IResetPasswordUseCase } from "../../../domain/interface/useCaseInterface/auth/reset-password-usecase.interface.js";
import { IClearFCMTokenUseCase } from "../../../domain/interface/useCaseInterface/auth/clear-fcm-token-usecase.interface.js";


@injectable()
export class AuthController implements IClientAuthController{

     constructor(
       @inject("IClientRegisterUseCase") 
       private _registerUseCase : IRegisterUseCase,

       @inject("ISendOtpEmailUseCase") 
       private _sendOtpEmailUseCase : ISendOtpEmailUseCase,

       @inject("IVerifyOtpEmailUseCase")
       private _varifyOtpUseCase : IVerifyOtpEmailUseCase,

       @inject("ILoginUserUseCase")
       private _loginUseCase : ILoginUserUseCase,

       @inject("IGenerateTokenUseCase")
       private _generateTokenUseCase : IGenerateTokenUseCase,

       @inject("IGoogleUseCase")
       private _googleUseCase: IGoogleUseCase,

       @inject("IRefreshTokenUseCase")
       private _refreshTokenUseCase: IRefreshTokenUseCase,

       @inject("IBlackListTokenUseCase")
       private _blackListTokenUseCase : IBlackListTokenUseCase,

       @inject("IRevokeRefreshTokenUseCase")
       private _revokeRefreshTokenUseCase: IRefreshTokenUseCase,

       @inject("IForgotPasswordUseCase")
       private _forgotPasswordUseCase: IForgotPasswordUseCase,

       @inject("IResetPasswordUseCase")
       private _resetPasswordUseCase: IResetPasswordUseCase,

       @inject("IClearFCMTokenUseCase")
       private _clearFCMTokenUseCase: IClearFCMTokenUseCase,

     ) {}
 



// ══════════════════════════════════════════════════════════
// 📧 Sending OTP to User Email
// ══════════════════════════════════════════════════════════
 

  async sendOtp(req: Request, res: Response): Promise<void> {
     try {
      console.log('otpsend',req.body)
      const {email}  = req.body
        console.log('otp sending....')
        await this._sendOtpEmailUseCase.execute(email)
       res.status(HTTP_STATUS.OK).json(SUCCESS_MESSAGES.OTP_SEND_SUCCESS)
     } catch (error) {
        handleErrorResponse(res, error)
      }
  }

  
  

     
// ══════════════════════════════════════════════════════════
// 📝 Register New User
// ══════════════════════════════════════════════════════════


  async register(req: Request, res: Response): Promise<void> {
      try {
        
        const {formdata, otpString} = req.body
        console.log('varifying...',formdata,otpString)
        
        await this._varifyOtpUseCase.execute(formdata.email, otpString)
        
        const {role} = formdata as {role: keyof typeof userSchemas}
          console.log(role)
        const schema = userSchemas[role]
          console.log(schema)
         if(!schema) {
           res.status(HTTP_STATUS.BAD_REQUEST).json({
            success:true,
            message: ERROR_MESSAGES.INVALID_CREDENTIALS
          })
          return;
         }

         const validatedData = schema.parse(formdata)

        const client = await this._registerUseCase.createUsers(validatedData)

         res.status(HTTP_STATUS.CREATED).json({message:SUCCESS_MESSAGES.CREATED , data: client})

      } catch (error) {
        handleErrorResponse(res,error)
      }
  }










// ══════════════════════════════════════════════════════════
// 🔐 User Login Controller
// ══════════════════════════════════════════════════════════

 async login(req: Request, res: Response): Promise<void> {
      try {
           const data = req.body as LoginUserDTO
            console.log('user data',data)
            // const validatedData = loginSchema.parse(data)
            // if(!validatedData){
            //   res.status(HTTP_STATUS.BAD_REQUEST).json({
            //     success:false,
            //     message: ERROR_MESSAGES.INSUFFICIENT_FUNDS,
            //   })
            // }
          const user = await this._loginUseCase.execute(data)

          if(!user.userId || !user.email || !user.role){
             throw new Error("User ID, email, or role is missing")
          }
          const token = await this._generateTokenUseCase.execute(
            user.userId as string,
            user.email,
            user.role
          )

        const accessTokenName = `${user.role}_access_token`
        const refreshTokenName = `${user.role}_refresh_token`
     
        setAuthCookies(
          res,
          token.accessToken,
          token.refreshToken,
          accessTokenName,
          refreshTokenName
        )
  
        const {password, ...userWihoutPassword} = user;

        res.status(HTTP_STATUS.OK).json({
           success:true,
           message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
           user:{
            ...userWihoutPassword,
           }
        })

      } catch (error) {
        handleErrorResponse(res,error)
      }
 }







// ══════════════════════════════════════════════════════════
//  User Google Login Controller
// ══════════════════════════════════════════════════════════
  async authenticateWithGoogle(req: Request, res: Response): Promise<void> {
      try {
         const {credential, client_id, role} = req.body
         const user = await this._googleUseCase.execute(
           credential,
           client_id,
           role
         )

    if(!user.userId || !user.email || !user.role){
      throw new Error("User ID, email, or role is missing")
    }

    const tokens = await this._generateTokenUseCase.execute(
       user.userId,
       user.email,
       user.role
    )

    const accessTokenName = `${user.role}_access_token`
    const refreshTokenName = `${user.role}_refresh_token`

     setAuthCookies(
       res,
       tokens.accessToken,
       tokens.refreshToken,
       accessTokenName,
       refreshTokenName
     )
     res.status(HTTP_STATUS.OK).json({
       success: true,
       message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
       user: user,
     })
      } catch (error) {
        handleErrorResponse(res, error)
      }
   }



   

// ══════════════════════════════════════════════════════════
//  User Logout
// ══════════════════════════════════════════════════════════


   async logout(req: Request, res: Response): Promise<void> {
		try {
			await this._blackListTokenUseCase.execute(
				(req as CustomRequest).user.access_token
			);

			await this._revokeRefreshTokenUseCase.execute(
				(req as CustomRequest).user.refresh_token
			);

      await this._clearFCMTokenUseCase.execute(
        (req as CustomRequest).user.userId,
        (req as CustomRequest).user.role
      )

			const user = (req as CustomRequest).user;
      console.log(user,'logout user')
			const accessTokenName = `${user.role}_access_token`;
			const refreshTokenName = `${user.role}_refresh_token`;
			clearAuthCookies(res, accessTokenName, refreshTokenName);
			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(res, error);
		}
	}




// ══════════════════════════════════════════════════════════
//  Token Refresh Handler
// ══════════════════════════════════════════════════════════


       handleTokenRefresh(req: Request, res: Response): void {
         try {
           const refreshToken = (req as CustomRequest).user.refresh_token;
           const newTokens = this._refreshTokenUseCase.execute(refreshToken)
           const accessTokenName = `${newTokens.role}_access_token`;
            updateCookieWithAccessToken(
              res,
              newTokens.accessToken,
              accessTokenName
            )
            res.status(HTTP_STATUS.OK).json({
               success: true,
               message: SUCCESS_MESSAGES.OPERATION_SUCCESS
         })
         } catch (error) {
            clearAuthCookies(
              res,
              `${(req as CustomRequest).user.role}_access_token`,
              `${(req as CustomRequest).user.role}_refresh_token`
            )
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
               message: ERROR_MESSAGES.INVALID_TOKEN
            })
         }
   }





// ══════════════════════════════════════════════════════════
//  Forgot Password Handler
// ══════════════════════════════════════════════════════════
  
  async forgotPassword(req: Request, res: Response): Promise<void> {
     try {
      const {email} = req.body
      await this._forgotPasswordUseCase.execute(email)
      res.status(HTTP_STATUS.OK).json(SUCCESS_MESSAGES.OTP_SEND_SUCCESS)
     } catch (error) {
      handleErrorResponse(res,error)
     }
    }





  

// ══════════════════════════════════════════════════════════
//  Reset Password Handler
// ══════════════════════════════════════════════════════════

async resetPassword(req: Request, res: Response): Promise<void> {
   try {
      const {password,token} = req.body
      console.log('token',token,password)
      await this._resetPasswordUseCase.execute(token, password)
      res.status(HTTP_STATUS.OK).json(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS)
   } catch (error) {
      handleErrorResponse(res,error)
   }
}

}
