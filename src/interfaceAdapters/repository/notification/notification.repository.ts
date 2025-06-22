import { injectable } from "tsyringe";
import { INotificationModel, notificationModel } from "../../../frameworks/database/mongodb/model/notification.model.js";
import { BaseRepository } from "../base.repository.js";
import { INotificationRepository } from "../../../domain/interface/repositoryInterfaces/notification/notification-repository.interface.js";





@injectable()
export class NotificationRepository extends BaseRepository<INotificationModel> implements INotificationRepository{
    constructor() {
        super(notificationModel)
    }
    
    async createNotification(userId: string, notificationType: string, title: string, body: string): Promise<INotificationModel> {
        return await this.model.create({
            userId,
            notificationType,
            title,
            body
        })
    }
    
}
