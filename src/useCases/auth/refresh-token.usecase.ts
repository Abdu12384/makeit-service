import { inject, injectable } from "tsyringe";
import { IRefreshTokenUseCase } from "../../domain/interface/useCaseInterface/auth/refresh-token-usecase.interface";
import { ITokenService } from "../../domain/interface/servicesInterface/jwt-service.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { JwtPayload } from "jsonwebtoken";






@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase{
   constructor(
     @inject("ITokenService") 
     private _tokenService : ITokenService
   ){}

   execute(refreshToken: string): { role: string; accessToken: string; } {
      const payload = this._tokenService.verifyRefreshToken(refreshToken)
      if(!payload){
         throw new CustomError(
           ERROR_MESSAGES.INVALID_TOKEN,
           HTTP_STATUS.BAD_REQUEST
         )
      }
      return{
         role: (payload as JwtPayload).role,
         accessToken: this._tokenService.generateAccessToken({
           userId: (payload as JwtPayload).userId,
           role: (payload as JwtPayload).role
         })
      }
   }
}