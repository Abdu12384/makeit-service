import { inject, injectable } from "tsyringe";
import { IGenerateTokenUseCase } from "../../domain/interface/useCaseInterface/auth/genarate-token-usecase.interface";
import { ITokenService } from "../../domain/interface/servicesInterface/jwt-service.interface";
import { IRefreshTokenReposiory } from "../../domain/interface/repositoryInterfaces/common-services/refresh-token.entity";
import { TRole } from "../../shared/constants";


@injectable()
export class GenerateTokenUseCase implements IGenerateTokenUseCase{
      
       constructor(
         @inject("ITokenService") private _tokenService: ITokenService,

         @inject("IRefreshTokenReposiory")
         private _refreshTokenRepository: IRefreshTokenReposiory
       ){}

   async execute(userId: string, email: string, role: string): Promise<{ accessToken: string; refreshToken: string; }> {
       
       const payload = {userId, role}
       const accessToken = this._tokenService.generateAccessToken(payload)
       const refreshToken = this._tokenService.generateRefreshToken(payload)
       
        
      await this._refreshTokenRepository.save({
         token: refreshToken,
         userType: role as TRole,
         user: userId,
         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })

      return{
         accessToken,
         refreshToken
      }
         
   }



}