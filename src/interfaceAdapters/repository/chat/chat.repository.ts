import { chatModel, IChatModel } from "../../../frameworks/database/mongodb/model/chat.model";
import { BaseRepository } from "../base.repository";
import { IChatRepository } from "../../../domain/interface/repositoryInterfaces/chat/chat-repository.interface";
import { IChatEntity } from "../../../domain/entities/chat.entity";
import { messageModel } from "../../../frameworks/database/mongodb/model/message.model";
import mongoose, { FilterQuery } from "mongoose";
import { injectable } from "tsyringe";
import { IMessageEntity } from "../../../domain/entities/message.entity";






@injectable()
export  class ChatRepository extends BaseRepository<IChatModel> implements IChatRepository {
    constructor() {
        super(chatModel);
    }

    async findOrCreateChat(
      senderId: string,
      senderModel: "client" | "vendor",
      receiverId: string,
      receiverModel: "client" | "vendor",
      chatId: string
    ): Promise<IChatEntity> {
      let chat = await chatModel.findOne({
        $or: [
          { senderId, senderModel, receiverId, receiverModel , chatId },
          { senderId: receiverId, senderModel: receiverModel, receiverId: senderId, receiverModel: senderModel , chatId },
        ],
      }).lean();
  
      if (!chat) {
        const newChat = await this.save({
          senderId,
          senderModel,
          receiverId,
          receiverModel,
          chatId,
          lastMessage: "",
          lastMessageAt: "",
        });
        return newChat as IChatEntity;
      }
  
      return chat as IChatEntity;
    }


    async saveMessage(message: {
      chatId: string;
      senderId: string;
      senderModel: "client" | "vendor";
      messageContent: string;
      sendedTime: Date;
      messageId: string;
    }): Promise<IMessageEntity> {
      const newMessage = new messageModel({
        ...message,
        seen: false,
      });
      const savedMessage = await newMessage.save();
      return savedMessage.toObject();
    }
  
    async updateChatLastMessage(chatId: string, lastMessage: string, lastMessageAt: string): Promise<void> {
      await chatModel.findOneAndUpdate(
        {chatId},
        {
        lastMessage,
        lastMessageAt,
      },
      {new:true}
      );
    }


    async getMessages(chatId: string, skip: number, limit: number): Promise<IMessageEntity[]> {
      return await messageModel.find({ chatId })
        // .sort({ sendedTime: 1 })
        // .skip(skip)
        // .limit(limit)
        .lean();
    }
  
    async getUserChats(userId: string): Promise<IChatEntity[]> {
      return await chatModel.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
        .sort({ updatedAt: -1 })
        .lean();
    }
  
    async markMessagesAsSeen(chatId: string, userId: string): Promise<void> {
      await messageModel.updateMany(
        { chatId, senderId: { $ne: userId }, seen: false },
        { seen: true }
      );
    }
   
    
}