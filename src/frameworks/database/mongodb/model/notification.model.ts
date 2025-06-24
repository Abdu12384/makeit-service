import { model, ObjectId } from "mongoose";
import { INotificationEntity } from "../../../../domain/entities/notification.entity";
import { notificationSchema } from "../schema/notification.schema";



export interface INotificationModel extends INotificationEntity {
    _id: ObjectId
} 

export const notificationModel = model<INotificationModel>('notification', notificationSchema);     