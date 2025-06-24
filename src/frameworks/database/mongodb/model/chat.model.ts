import { model } from "mongoose";
import { chatSchema } from "../schema/chat.schema";
import { ObjectId } from "mongoose";
import { IChatEntity } from "../../../../domain/entities/chat.entity";




export  interface IChatModel extends IChatEntity {
  _id: ObjectId;
}


export const chatModel = model<IChatModel>("Chat", chatSchema);
