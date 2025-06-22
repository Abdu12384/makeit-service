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
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { NotificationType } from "../../shared/dtos/notification.js";
let CreateBookingUseCase = class CreateBookingUseCase {
    _bookingRepository;
    _pushNotificationService;
    constructor(_bookingRepository, _pushNotificationService) {
        this._bookingRepository = _bookingRepository;
        this._pushNotificationService = _pushNotificationService;
    }
    async execute(serviceId, date, email, phone, vendorId, userId) {
        const bookingId = generateUniqueId("booking");
        const bookingsDetails = await this._bookingRepository.findExactApprovedBookingByVendorAndDate(vendorId, date);
        const bookedDate = bookingsDetails?.date;
        console.log("bookeddate", bookedDate);
        if (bookedDate && bookingsDetails.vendorApproval === "Approved") {
            if (Array.isArray(bookedDate) && bookedDate.length > 0) {
                throw new CustomError(`${new Date(bookedDate[0]).toDateString()} is already booked. Please select another date.`, HTTP_STATUS.BAD_REQUEST);
            }
        }
        const booking = await this._bookingRepository.save({
            bookingId,
            clientId: userId,
            serviceId,
            email,
            phone,
            vendorId,
            date: [date],
        });
        await this._pushNotificationService.sendNotification(vendorId, NotificationType.SERVICE_BOOKING, `You have received a new booking for ${new Date(date).toDateString()}`, "booking", "vendor");
    }
};
CreateBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IPushNotificationService")),
    __metadata("design:paramtypes", [Object, Object])
], CreateBookingUseCase);
export { CreateBookingUseCase };
//# sourceMappingURL=create-booking.usecase.js.map