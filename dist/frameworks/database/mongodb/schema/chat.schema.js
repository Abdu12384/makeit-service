"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSchema = void 0;
const mongoose_1 = require("mongoose");
exports.chatSchema = new mongoose_1.Schema({
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