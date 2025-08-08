import { inject, injectable } from "tsyringe";
import { IChatUseCase } from "../../domain/interface/useCaseInterface/chat/chat-usecaes.interface";
import { IChatRepository } from "../../domain/interface/repositoryInterfaces/chat/chat-repository.interface";
import { IChatEntity } from "../../domain/entities/chat.entity";
import { IMessageEntity } from "../../domain/entities/message.entity";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { IVendorEntity } from "../../domain/entities/vendor.entity";
import { IClientEntity } from "../../domain/entities/client.entity";
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface";





@injectable()
export class ChatUseCase implements IChatUseCase {
  constructor(
    @inject("IChatRepository") private chatRepository: IChatRepository,
    @inject("IClientRepository") private clientRepository: IClientRepository,
    @inject("IVendorRepository") private vendorRepository: IVendorRepository,
    @inject("IPushNotificationService") private pushNotificationService: IPushNotificationService
  ) {}

  //======================================================
  async startChat(data: {
    senderId: string;
    senderModel: "client" | "vendor";
    receiverId: string;
    receiverModel: "client" | "vendor";
  }): Promise<string> {
    const { senderId, senderModel, receiverId, receiverModel } = data;


    if (!senderId || !senderModel || !receiverId || !receiverModel) {
      throw new Error("All fields are required");
    }

    if (senderId === receiverId) {
      throw new Error("Cannot start a chat with yourself");
    }

    const chatId = generateUniqueId()

     await this.chatRepository.findOrCreateChat(
      senderId,
      senderModel,
      receiverId,
      receiverModel,
      chatId
    );

    return chatId;
  }

  //======================================================
  async sendMessage(data: {
    chatId: string;
    senderId: string;
    senderModel: "client" | "vendor";
    messageContent: string;
  }): Promise<IMessageEntity> {
    const { chatId, senderId, senderModel, messageContent } = data;

    if (!chatId || !senderId || !senderModel || !messageContent) {
      throw new Error("Chat ID, sender ID, sender model, and message content are required");
    }


    const chat = await this.chatRepository.findOne({chatId});
    if (!chat || (chat.senderId !== senderId && chat.receiverId !== senderId)) {
      throw new Error("Unauthorized to send message in this chat");
    }





    const messageId = generateUniqueId()

    const sendedTime = new Date();
    const newMessage = await this.chatRepository.saveMessage({
      chatId,
      senderId,
      senderModel,
      messageContent,
      sendedTime,
      messageId,
    });


    await this.chatRepository.updateChatLastMessage(
      chatId,
      messageContent,
      sendedTime.toISOString()
    );

    const receiverId = chat.senderId === senderId ? chat.receiverId : chat.senderId;
    const receiverModel = chat.senderId === senderId ? chat.receiverModel : chat.senderModel;

    await this.findUserById(receiverId, receiverModel);
    const sender = await this.findUserById(senderId, senderModel);

    
        await this.pushNotificationService.sendNotification(
          receiverId,
          "New Message",
          `You have a new message from ${sender?.name}`,
          "new_message",
          receiverModel
        );

    return newMessage;
  }


  //======================================================
  async getMessages(chatId: string): Promise<IMessageEntity[]> {
    if (!chatId) {
      throw new Error("Chat ID is required");
    }

    const messages = await this.chatRepository.getMessages(chatId);
    return messages;
  }

  //======================================================
 //======================================================
 async getUserChats(userId: string): Promise<IChatEntity[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const chats = await this.chatRepository.getUserChats(userId);

  // Enrich chats with receiver details
  const enrichedChats = await Promise.all(
    chats.map(async (chat) => {
      const receiverId = chat.senderId === userId ? chat.receiverId : chat.senderId;
      const receiverModel = chat.senderId === userId ? chat.receiverModel : chat.senderModel;

      const receiver = await this.findUserById(receiverId, receiverModel);

    
      return {
        ...chat,
        receiverName: receiver?.name || receiverId,
        receiverProfileImage: receiver?.profileImage || undefined,
      };
    })
  );

  return enrichedChats;
}

  //======================================================
  async markMessagesAsSeen(chatId: string, userId: string): Promise<void> {
    if (!chatId || !userId) {
      throw new Error("Chat ID and user ID are required");
    }

    const chat = await this.chatRepository.findOne({chatId});
    if (!chat || (chat.senderId !== userId && chat.receiverId !== userId)) {
      throw new Error("Unauthorized to view this chat");
    }
    await this.chatRepository.markMessagesAsSeen(chatId, userId);
  }



  //======================================================
  async findUserById(userId: string, model: "client" | "vendor"): Promise<IChatEntity | IClientEntity | IVendorEntity | null> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (model === "client") {
      return await this.clientRepository.findOne({userId});
    } else {
      return await this.vendorRepository.findOne({userId});
    }
  }


  //======================================================
  async getChatById(chatId: string): Promise<IChatEntity> {
    if (!chatId) {
      throw new Error("Chat ID is required");
    }
    const chat = await this.chatRepository.findOne({chatId});
    if (!chat) {
      throw new Error("Chat not found");
    }
    return chat;
  }

}







