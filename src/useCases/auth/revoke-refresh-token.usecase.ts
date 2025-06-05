import { inject, injectable } from "tsyringe";
import { IRevokeRefreshTokenUseCase } from "../../domain/interface/useCaseInterface/auth/revok-refresh-token-usecase.interface";
import { IRefreshTokenReposiory } from "../../domain/interface/repositoryInterfaces/common-services/refresh-token.entity";




@injectable()

export class RevokeRefreshTokenUseCase implements IRevokeRefreshTokenUseCase{
   constructor(
     @inject("IRefreshTokenReposiory")
     private _refreshTokenRepository: IRefreshTokenReposiory
   ){}

   async execute(token: string): Promise<void> {
      await this._refreshTokenRepository.revokeRefreshToken(token)
   }
}