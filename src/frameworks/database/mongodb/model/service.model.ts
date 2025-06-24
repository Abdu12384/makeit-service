import { model, ObjectId } from "mongoose";
import { IServiceEntity } from "../../../../domain/entities/service.entity";
import { serviceSchema } from "../schema/service.schema";



export interface IServiceModel extends IServiceEntity, Document{
   _id: ObjectId
} 

export const serviceModel = model<IServiceModel>("Service", serviceSchema);