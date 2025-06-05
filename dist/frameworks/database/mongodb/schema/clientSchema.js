import { Schema } from 'mongoose';
export const clientSchema = new Schema({
    userId: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    profileImage: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ["active", "block"],
        default: "active"
    },
    role: {
        type: String,
        enum: ["client", "vendor", "admin"],
        default: "client"
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: false
    },
    googleVarified: {
        type: Boolean,
        default: false,
        required: false
    }
}, {
    timestamps: true
});
//# sourceMappingURL=clientSchema.js.map