import { Schema } from "mongoose";
export const messageSchema = new Schema({
    chatId: {
        type: String,
        ref: 'chat',
        required: true
    },
    messageContent: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    sendedTime: {
        type: Date,
        default: Date.now
    },
    senderId: {
        type: String,
        refPath: 'senderModel'
    },
    senderModel: {
        type: String,
        enum: ['client', 'vendors'],
        required: true
    }
}, {
    timestamps: true
});
//# sourceMappingURL=message.model.js.map