import { model, ObjectId } from "mongoose";
import { IRefreshTokenEntity } from "../../../../domain/entities/refresh-token.entity.js";
import { refreshTokenSchema } from "../schema/refresh-token.schema.js";


export interface IRefreshTokenModel extends IRefreshTokenEntity{
   _id: ObjectId
}

export const RefreshTokenModel = model<IRefreshTokenModel>("RefreshToken",refreshTokenSchema)