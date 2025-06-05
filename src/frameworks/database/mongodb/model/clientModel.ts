import { clientSchema } from "../schema/clientSchema.js";
import { IClientEntity } from "../../../../domain/entities/client.entity.js";
import { model,Document,ObjectId } from "mongoose";

export interface IClientModel extends Omit<IClientEntity,"_id">,Document{
   _id:ObjectId
}

export const ClientModel = model<IClientModel>("client",clientSchema)