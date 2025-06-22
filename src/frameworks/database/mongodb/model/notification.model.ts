import { model, ObjectId } from "mongoose";
import { INotificationEntity } from "../../../../domain/entities/notification.entity.js";
import { notificationSchema } from "../schema/notification.schema.js";



export interface INotificationModel extends INotificationEntity {
    _id: ObjectId
} 

export const notificationModel = model<INotificationModel>('notification', notificationSchema);     