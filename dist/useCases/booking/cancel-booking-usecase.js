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
import { NotificationType } from "../../shared/dtos/notification.js";
let CancelBookingUseCase = class CancelBookingUseCase {
    _bookingRepository;
    _pushNotificationService;
    constructor(_bookingRepository, _pushNotificationService) {
        this._bookingRepository = _bookingRepository;
        this._pushNotificationService = _pushNotificationService;
    }
    async execute(bookingId) {
        const booking = await this._bookingRepository.findOne({ bookingId });
        if (!booking) {
            throw new Error("Booking not found");
        }
        booking.status = "Cancelled";
        await this._bookingRepository.update({ bookingId }, booking);
        await this._pushNotificationService.sendNotification(booking.clientId, NotificationType.CANCEL_SERVICE_BOOKING, `Your booking for ${new Date(booking.date[0]).toDateString()} has been cancelled`, "booking", "client");
        await this._pushNotificationService.sendNotification(booking.vendorId, NotificationType.CANCEL_SERVICE_BOOKING, `Your booking for ${new Date(booking.date[0]).toDateString()} has been cancelled`, "booking", "vendor");
    }
};
CancelBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IPushNotificationService")),
    __metadata("design:paramtypes", [Object, Object])
], CancelBookingUseCase);
export { CancelBookingUseCase };
//# sourceMappingURL=cancel-booking-usecase.js.map