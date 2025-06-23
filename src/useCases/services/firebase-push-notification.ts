import { inject, injectable } from "tsyringe";
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface.js";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface.js";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface.js";
import { messaging } from "../../shared/config.js";
import { INotificationRepository } from "../../domain/interface/repositoryInterfaces/notification/notification-repository.interface.js";









@injectable()
export class pushNotificationService implements IPushNotificationService{

  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,
    @inject("INotificationRepository")
    private _notificationRepo: INotificationRepository

  ) {}

  async sendNotification(
    userId: string,
    title: string,
    body: string,
    notificationType: string,
    model: "client" | "vendor"
): Promise<void> {
    const notification = {
        userId,
        title,
        body,
        notificationType
    };
    let repo;
    if(model === "client"){
      repo = this._clientRepository;
    }else{
      repo = this._vendorRepository;
    }
    const user = await repo.findOne({userId});
    if (user?.userId) {
      await this._notificationRepo.createNotification(
        user.userId,
        notificationType,
        title,
        body
      );
    }

    if(user?.fcmToken) {
        await messaging.send({
            notification: {
                title: title,
                body: body
            },
            token: user.fcmToken
        });
    }
 }
}