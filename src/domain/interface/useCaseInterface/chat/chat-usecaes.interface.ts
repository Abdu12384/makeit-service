import { IChatEntity } from "../../../entities/chat.entity";
import { IClientEntity } from "../../../entities/client.entity";
import { IMessageEntity } from "../../../entities/message.entity";
import { IVendorEntity } from "../../../entities/vendor.entity";

export interface IChatUseCase {
  startChat(data: {
    senderId: string;
    senderModel: "client" | "vendor";
    receiverId: string;
    receiverModel: "client" | "vendor";
  }): Promise<string>;

  sendMessage(data: {
    chatId: string;
    senderId: string;
    senderModel: "client" | "vendor";
    messageContent: string;
  }): Promise<IMessageEntity>;

  getMessages(chatId: string, skip: number, limit: number): Promise<IMessageEntity[]>;

  getUserChats(userId: string): Promise<IChatEntity[]>;

  markMessagesAsSeen(chatId: string, userId: string): Promise<void>;

  findUserById(userId: string, model: "client" | "vendor"): Promise<IChatEntity | IClientEntity | IVendorEntity | null>;

  getChatById(chatId: string): Promise<IChatEntity>;
}