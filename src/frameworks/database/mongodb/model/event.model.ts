import { model,ObjectId } from "mongoose";
import { IEventEntity } from "../../../../domain/entities/event.entity";
import { eventSchema } from "../schema/event.schema";

export interface IEventModel extends IEventEntity{
  _id:ObjectId   
}

export const eventModel = model<IEventModel>('event',eventSchema)
  