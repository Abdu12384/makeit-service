import { IBaseRepository } from "../base-repository.interface";
import { INotificationModel } from "../../../../frameworks/database/mongodb/model/notification.model";




export interface INotificationRepository extends IBaseRepository<INotificationModel>{
    createNotification(userId: string, notificationType: string, title: string, body: string): Promise<INotificationModel>;
}
