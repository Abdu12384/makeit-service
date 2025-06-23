var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { messaging } from "../../shared/config.js";
let pushNotificationService = class pushNotificationService {
    _clientRepository;
    _vendorRepository;
    _notificationRepo;
    constructor(_clientRepository, _vendorRepository, _notificationRepo) {
        this._clientRepository = _clientRepository;
        this._vendorRepository = _vendorRepository;
        this._notificationRepo = _notificationRepo;
    }
    async sendNotification(userId, title, body, notificationType, model) {
        const notification = {
            userId,
            title,
            body,
            notificationType
        };
        let repo;
        if (model === "client") {
            repo = this._clientRepository;
        }
        else {
            repo = this._vendorRepository;
        }
        const user = await repo.findOne({ userId });
        if (user?.userId) {
            await this._notificationRepo.createNotification(user.userId, notificationType, title, body);
        }
        if (user?.fcmToken) {
            await messaging.send({
                notification: {
                    title: title,
                    body: body
                },
                token: user.fcmToken
            });
        }
    }
};
pushNotificationService = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IVendorRepository")),
    __param(2, inject("INotificationRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], pushNotificationService);
export { pushNotificationService };
//# sourceMappingURL=firebase-push-notification.js.map