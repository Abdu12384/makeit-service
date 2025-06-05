import { Schema } from "mongoose";
export const otpSchema = new Schema({
    otp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        // Automatically delete document 60 seconds after `expiresAt`
        expires: 60,
    },
}, { timestamps: true });
//# sourceMappingURL=otp.schema.js.map