"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../../shared/constants");
exports.notificationSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        ref: "Client",
        //  required: true 
    },
    type: {
        type: String,
        enum: constants_1.NotificationType,
        // required: true,
    },
    message: {
        type: String,
        // required: true 
    },
    title: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
//# sourceMappingURL=notification.schema.js.map