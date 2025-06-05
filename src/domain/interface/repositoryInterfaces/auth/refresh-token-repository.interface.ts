import { IRefreshTokenEntity } from "../../../entities/refresh-token.entity";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IRefreshTokenRepository
	extends IBaseRepository<IRefreshTokenEntity> {
	revokeRefreshToken(token: string): Promise<void>;
}
