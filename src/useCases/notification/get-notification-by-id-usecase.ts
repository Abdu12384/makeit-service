import { inject, injectable } from "tsyringe";
import { IGetNotificationByIdUseCase } from "../../domain/interface/useCaseInterface/notification/get-notification-id-by-usecase-interface";
import { INotificationRepository } from "../../domain/interface/repositoryInterfaces/notification/notification-repository.interface";
import { INotificationEntity } from "../../domain/entities/notification.entity";








@injectable()
export class GetNotificationByIdUseCase implements IGetNotificationByIdUseCase{
    constructor(
        @inject("INotificationRepository") private _notificationRepository: INotificationRepository
    ){}

    async execute(userId: string): Promise<{items:INotificationEntity[],total:number}> {

        const notification = await this._notificationRepository.findAll({userId,isRead:false},0,10,{createdAt:-1});
        if(!notification){
            throw new Error("Notification not found");
        }
        return notification;
    }
}
        