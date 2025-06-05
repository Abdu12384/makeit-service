
import { IChatModel } from "../../../../frameworks/database/mongodb/model/chat.model";
import { IChatEntity } from "../../../entities/chat.entity";
import { IMessageEntity } from "../../../entities/message.entity";
import { IBaseRepository } from "../base-repository.interface";






export interface IChatRepository extends IBaseRepository<IChatModel> {

  // findOneObj(chatId: string): Promise<IChatEntity>;

  findOrCreateChat(
    senderId: string,
    senderModel: "client" | "vendor",
    receiverId: string,
    receiverModel: "client" | "vendor",
    chatId: string
  ): Promise<IChatEntity>;

  saveMessage(message: {
    chatId: string;
    senderId: string;
    senderModel: "client" | "vendor";
    messageContent: string;
    sendedTime: Date;
    messageId: string;
  }): Promise<IMessageEntity>;


  updateChatLastMessage(chatId: string, lastMessage: string, lastMessageAt: string): Promise<void>;

  getMessages(chatId: string, skip: number, limit: number): Promise<IMessageEntity[]>;

  getUserChats(userId: string): Promise<IChatEntity[]>;

  markMessagesAsSeen(chatId: string, userId: string): Promise<void>;
}

