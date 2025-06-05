import { chatModel } from "../../../frameworks/database/mongodb/model/chat.model.js";
import { BaseRepository } from "../base.repository.js";
import { messageModel } from "../../../frameworks/database/mongodb/model/message.model.js";
export class ChatRepository extends BaseRepository {
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
}
//# sourceMappingURL=chat.repository.js.map