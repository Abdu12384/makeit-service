import { inject, injectable } from "tsyringe";
import { IUpdateNotificationReadUseCase } from "../../domain/interface/useCaseInterface/notification/update-notificaton-read-usecase.interface";
import { INotificationRepository } from "../../domain/interface/repositoryInterfaces/notification/notification-repository.interface";







@injectable()
export class UpdateNotificationReadUseCase implements IUpdateNotificationReadUseCase {
    constructor(
        @inject("INotificationRepository") private _notificationRepository: INotificationRepository
    ){}
    async execute(userId: string): Promise<void> {
        const notifications = await this._notificationRepository.find({userId,isRead:false})
      for (const notification of notifications) {
        await this._notificationRepository.update(
          { _id: notification._id },
          { isRead: true }
        );
      }
    }
}