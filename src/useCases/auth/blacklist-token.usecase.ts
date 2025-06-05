import { inject, injectable } from "tsyringe";
import { IBlackListTokenUseCase } from "../../domain/interface/useCaseInterface/auth/blacklist-token-usecase.interface";
import { JwtPayload } from "jsonwebtoken";
import { ITokenService } from "../../domain/interface/servicesInterface/jwt-service.interface";
import { IRedisTokenRepository } from "../../domain/interface/repositoryInterfaces/redis/redis-token-repository.interface";





@injectable()
export class BlackListTokenUseCase implements IBlackListTokenUseCase {
   constructor(
    @inject("ITokenService") private _tokenService: ITokenService,

    @inject("IRedisTokenRepository")
    private _redisTokenRepository: IRedisTokenRepository

   ){}

   async execute(token: string): Promise<void> {
     const decode: string |  JwtPayload | null = 
      this._tokenService.verifyAccessToken(token);
      if(!decode || typeof decode === "string" || !decode.exp){
         throw new Error("Invalid Token: Missing expiratrion time")
      }

      const expiresIn = decode.exp - Math.floor(Date.now() / 1000);
      if(expiresIn > 0){
        await this._redisTokenRepository.blackListToken(token, expiresIn)
      }
   }
}