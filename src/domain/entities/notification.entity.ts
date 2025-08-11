import { ObjectId } from "mongoose";
import { NotificationType } from "../../shared/constants";
export interface INotificationEntity {
    _id?:ObjectId | string;
    userId:ObjectId | string;
    type:NotificationType,
    message:string,
    title:string,
    isRead:boolean,
}
