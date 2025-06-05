import { IRefreshTokenEntity } from "../../../entities/refresh-token.entity";
import { IBaseRepository } from "../base-repository.interface";


export interface IRefreshTokenReposiory extends IBaseRepository<IRefreshTokenEntity>{
  revokeRefreshToken(token: string): Promise<void>;
}