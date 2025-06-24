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
let RescheduleBookingUseCase = class RescheduleBookingUseCase {
    _bookingRepository;
    _pushNotificationService;
    constructor(_bookingRepository, _pushNotificationService) {
        this._bookingRepository = _bookingRepository;
        this._pushNotificationService = _pushNotificationService;
    }
    async execute(bookingId, selectedDate, rescheduleReason) {
        const booking = await this._bookingRepository.findOne({ bookingId });
        if (!booking) {
            throw new Error("Booking not found.");
        }
        await this._bookingRepository.updateOne({ bookingId }, {
            $set: {
                date: [selectedDate],
                status: "Rescheduled",
                rescheduleReason,
            },
        });
        this._pushNotificationService.sendNotification(booking.clientId, NotificationType.RESCHEDULE_SERVICE_BOOKING, `Your booking has been rescheduled to ${selectedDate}.`, "booking", "client");
    }
};
RescheduleBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IPushNotificationService")),
    __metadata("design:paramtypes", [Object, Object])
], RescheduleBookingUseCase);
export { RescheduleBookingUseCase };
//# sourceMappingURL=resedul-booking.usecase.js.map