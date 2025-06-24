import { Schema } from "mongoose";
import { INotificationModel } from "../model/notification.model";
import { NotificationType } from "../../../../shared/dtos/notification";

export const notificationSchema = new Schema<INotificationModel>({
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