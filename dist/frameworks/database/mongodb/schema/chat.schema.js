import { Schema } from "mongoose";
export const chatSchema = new Schema({
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
});
//# sourceMappingURL=chat.schema.js.map