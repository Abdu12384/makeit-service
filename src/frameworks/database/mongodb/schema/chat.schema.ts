import { Schema } from "mongoose";
import { IChatModel } from "../model/chat.model";

export const chatSchema = new Schema<IChatModel>({
    chatId: {
        type: String,
        required: true
    },
    lastMessage: {
        type: String
    },
    lastMessageAt: {
        type: String
    },
    receiverId: {
        type: String,
        refPath: 'receiverModel'
    },
    senderId: {
        type: String,
        refPath: 'senderModel'
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['client', 'vendor']
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['client', 'vendor']
    }
}, {
    timestamps: true
})