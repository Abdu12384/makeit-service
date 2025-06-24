import { model, ObjectId } from "mongoose";
import { IRefreshTokenEntity } from "../../../../domain/entities/refresh-token.entity";
import { refreshTokenSchema } from "../schema/refresh-token.schema";


export interface IRefreshTokenModel extends IRefreshTokenEntity{
   _id: ObjectId
}

export const RefreshTokenModel = model<IRefreshTokenModel>("RefreshToken",refreshTokenSchema)