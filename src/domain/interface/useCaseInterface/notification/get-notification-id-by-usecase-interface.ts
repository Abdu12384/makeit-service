import { INotificationEntity } from "../../../entities/notification.entity";

export interface IGetNotificationByIdUseCase{
    execute(userId: string): Promise<{items:INotificationEntity[],total:number}>
}