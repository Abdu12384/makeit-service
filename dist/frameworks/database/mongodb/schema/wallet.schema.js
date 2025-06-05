import { Schema } from "mongoose";
export const walletSchema = new Schema({
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        ref: 'userModel',
        required: true
    },
    userModel: {
        type: String,
        required: true,
        enum: ['client', 'vendors']
    },
    walletId: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
//# sourceMappingURL=wallet.schema.js.map