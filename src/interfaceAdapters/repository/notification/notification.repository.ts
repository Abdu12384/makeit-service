import { injectable } from "tsyringe";
import { INotificationModel, notificationModel } from "../../../frameworks/database/mongodb/model/notification.model";
import { BaseRepository } from "../base.repository";
import { INotificationRepository } from "../../../domain/interface/repositoryInterfaces/notification/notification-repository.interface";





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
