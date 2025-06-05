var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { chatModel } from "../../../frameworks/database/mongodb/model/chat.model.js";
import { BaseRepository } from "../base.repository.js";
import { messageModel } from "../../../frameworks/database/mongodb/model/message.model.js";
import { injectable } from "tsyringe";
let ChatRepository = class ChatRepository extends BaseRepository {
    constructor() {
        super(chatModel);
    }
    // async findOneObj(chatId: string) {
    //   console.log("findOneObj-------------------------------------------", chatId);
    //   return this.model.findOne({_id:new mongoose.Types.ObjectId(chatId)});
    // }
    async findOrCreateChat(senderId, senderModel, receiverId, receiverModel, chatId) {
        let chat = await chatModel.findOne({
            $or: [
                { senderId, senderModel, receiverId, receiverModel, chatId },
                { senderId: receiverId, senderModel: receiverModel, receiverId: senderId, receiverModel: senderModel, chatId },
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
            return newChat;
        }
        return chat;
    }
    async saveMessage(message) {
        const newMessage = new messageModel({
            ...message,
            seen: false,
        });
        const savedMessage = await newMessage.save();
        return savedMessage.toObject();
    }
    async updateChatLastMessage(chatId, lastMessage, lastMessageAt) {
        await chatModel.findOneAndUpdate({ chatId }, {
            lastMessage,
            lastMessageAt,
        }, { new: true });
    }
    async getMessages(chatId, skip, limit) {
        return await messageModel.find({ chatId })
            // .sort({ sendedTime: 1 })
            // .skip(skip)
            // .limit(limit)
            .lean();
    }
    async getUserChats(userId) {
        return await chatModel.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        })
            .sort({ updatedAt: -1 })
            .lean();
    }
    async markMessagesAsSeen(chatId, userId) {
        await messageModel.updateMany({ chatId, senderId: { $ne: userId }, seen: false }, { seen: true });
    }
};
ChatRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], ChatRepository);
export { ChatRepository };
//# sourceMappingURL=chat.repository.js.map