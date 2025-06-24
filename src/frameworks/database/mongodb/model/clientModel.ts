import { clientSchema } from "../schema/clientSchema";
import { IClientEntity } from "../../../../domain/entities/client.entity";
import { model,Document,ObjectId } from "mongoose";

export interface IClientModel extends Omit<IClientEntity,"_id">,Document{
   _id:ObjectId
}

export const ClientModel = model<IClientModel>("client",clientSchema)