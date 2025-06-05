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
let UpdateBookingStatusUseCase = class UpdateBookingStatusUseCase {
    _bookingRepository;
    _mailService;
    constructor(_bookingRepository, _mailService) {
        this._bookingRepository = _bookingRepository;
        this._mailService = _mailService;
    }
    async execute(bookingId, status, reason) {
        const booking = await this._bookingRepository.findOne({ bookingId });
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (status === "Approved") {
            booking.vendorApproval = "Approved";
            booking.status = "Pending";
        }
        else if (status === "Rejected") {
            booking.vendorApproval = "Rejected";
            booking.status = "Rejected";
            booking.rejectionReason = reason;
            await this._mailService.sendCustomEmail(booking.email, "Booking Rejected", `Your booking has been rejected. Reason: ${reason || "No reason provided."}`);
        }
        else if (status === "Completed") {
            booking.isComplete = true;
            booking.status = "Completed";
        }
        console.log("booking", booking);
        await this._bookingRepository.update({ bookingId }, booking);
    }
};
UpdateBookingStatusUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IEmailService")),
    __metadata("design:paramtypes", [Object, Object])
], UpdateBookingStatusUseCase);
export { UpdateBookingStatusUseCase };
//# sourceMappingURL=update-booking-status.usecase.js.map