var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
let ChatUseCase = class ChatUseCase {
    chatRepository;
    clientRepository;
    vendorRepository;
    pushNotificationService;
    constructor(chatRepository, clientRepository, vendorRepository, pushNotificationService) {
        this.chatRepository = chatRepository;
        this.clientRepository = clientRepository;
        this.vendorRepository = vendorRepository;
        this.pushNotificationService = pushNotificationService;
    }
    //======================================================
    async startChat(data) {
        const { senderId, senderModel, receiverId, receiverModel } = data;
        console.log("startChat-------------------------------------------", data);
        if (!senderId || !senderModel || !receiverId || !receiverModel) {
            throw new Error("All fields are required");
        }
        if (senderId === receiverId) {
            throw new Error("Cannot start a chat with yourself");
        }
        const chatId = generateUniqueId("chat");
        const chat = await this.chatRepository.findOrCreateChat(senderId, senderModel, receiverId, receiverModel, chatId);
        return chatId;
    }
    //======================================================
    async sendMessage(data) {
        const { chatId, senderId, senderModel, messageContent } = data;
        console.log("sendMessage-------------------------------------------", data);
        if (!chatId || !senderId || !senderModel || !messageContent) {
            throw new Error("Chat ID, sender ID, sender model, and message content are required");
        }
        const chat = await this.chatRepository.findOne({ chatId });
        if (!chat || (chat.senderId !== senderId && chat.receiverId !== senderId)) {
            throw new Error("Unauthorized to send message in this chat");
        }
        console.log("chat-------------------------------------------", chat);
        const messageId = generateUniqueId("message");
        const sendedTime = new Date();
        const newMessage = await this.chatRepository.saveMessage({
            chatId,
            senderId,
            senderModel,
            messageContent,
            sendedTime,
            messageId,
        });
        await this.chatRepository.updateChatLastMessage(chatId, messageContent, sendedTime.toISOString());
        const receiverId = chat.senderId === senderId ? chat.receiverId : chat.senderId;
        const receiverModel = chat.senderId === senderId ? chat.receiverModel : chat.senderModel;
        console.log("receiverModel-------------------------------------------", receiverModel);
        const receiver = await this.findUserById(receiverId, receiverModel);
        await this.pushNotificationService.sendNotification(receiverId, "New Message", "You have a new message", "new_message", receiverModel);
        return newMessage;
    }
    //======================================================
    async getMessages(chatId, skip, limit) {
        if (!chatId) {
            throw new Error("Chat ID is required");
        }
        const messages = await this.chatRepository.getMessages(chatId, skip, limit);
        return messages;
    }
    //======================================================
    //======================================================
    async getUserChats(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        const chats = await this.chatRepository.getUserChats(userId);
        // Enrich chats with receiver details
        const enrichedChats = await Promise.all(chats.map(async (chat) => {
            const receiverId = chat.senderId === userId ? chat.receiverId : chat.senderId;
            const receiverModel = chat.senderId === userId ? chat.receiverModel : chat.senderModel;
            const receiver = await this.findUserById(receiverId, receiverModel);
            return {
                ...chat,
                receiverName: receiver?.name || receiverId,
                receiverProfileImage: receiver?.profileImage || undefined,
            };
        }));
        return enrichedChats;
    }
    //======================================================
    async markMessagesAsSeen(chatId, userId) {
        if (!chatId || !userId) {
            throw new Error("Chat ID and user ID are required");
        }
        const chat = await this.chatRepository.findOne({ chatId });
        if (!chat || (chat.senderId !== userId && chat.receiverId !== userId)) {
            throw new Error("Unauthorized to view this chat");
        }
        await this.chatRepository.markMessagesAsSeen(chatId, userId);
    }
    //======================================================
    async findUserById(userId, model) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        if (model === "client") {
            return await this.clientRepository.findOne({ userId });
        }
        else {
            return await this.vendorRepository.findOne({ userId });
        }
    }
    //======================================================
    async getChatById(chatId) {
        if (!chatId) {
            throw new Error("Chat ID is required");
        }
        const chat = await this.chatRepository.findOne({ chatId });
        if (!chat) {
            throw new Error("Chat not found");
        }
        return chat;
    }
};
ChatUseCase = __decorate([
    injectable(),
    __param(0, inject("IChatRepository")),
    __param(1, inject("IClientRepository")),
    __param(2, inject("IVendorRepository")),
    __param(3, inject("IPushNotificationService")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ChatUseCase);
export { ChatUseCase };
//# sourceMappingURL=chat.usecase.js.map