import { Schema } from "mongoose";
import { NotificationType } from "../../../../shared/dtos/notification.js";
export const notificationSchema = new Schema({
    userId: {
        type: String,
        ref: "Client",
        //  required: true 
    },
    type: {
        type: String,
        enum: NotificationType,
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