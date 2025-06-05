import { model } from "mongoose";
import { IMessageEntity } from "../../../../domain/entities/message.entity.js";
import { messageSchema } from "../schema/message.schema.js";
import { ObjectId } from "mongoose";




export interface IMessageModel extends IMessageEntity {
  _id: ObjectId;
}

export const messageModel = model<IMessageModel>("Message", messageSchema);
