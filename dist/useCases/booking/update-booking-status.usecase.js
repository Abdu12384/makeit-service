"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBookingStatusUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
let UpdateBookingStatusUseCase = class UpdateBookingStatusUseCase {
    constructor(_bookingRepository, _mailService) {
        this._bookingRepository = _bookingRepository;
        this._mailService = _mailService;
    }
    execute(bookingId, status, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this._bookingRepository.findOne({ bookingId });
            if (!booking) {
                throw new Error("Booking not found");
            }
            if (status === "Cancelled") {
                booking.status = "Cancelled";
                this._mailService.sendCustomEmail(booking.email, "Booking Cancelled", `Your booking has been cancelled. Reason: ${reason || "No reason provided."}`);
            }
            if (status === "Approved") {
                // const conflict = await this._bookingRepository.checkVendorBookingConflict(
                //   booking.vendorId,
                //   booking.date[0] as Date,
                //   booking.bookingId as string,
                // );
                // if (conflict) throw new CustomError("You already have an approved booking on this date.",HTTP_STATUS.BAD_REQUEST);
                booking.vendorApproval = "Approved";
                booking.status = "Pending";
            }
            else if (status === "Rejected") {
                booking.vendorApproval = "Rejected";
                booking.status = "Rejected";
                booking.rejectionReason = reason;
                yield this._mailService.sendCustomEmail(booking.email, "Booking Rejected", `Your booking has been rejected. Reason: ${reason || "No reason provided."}`);
            }
            else if (status === "Completed") {
                const today = new Date();
                const bookingDate = new Date(booking.date[0]);
                if (bookingDate > today) {
                    throw new custom_error_1.CustomError("You can only mark this booking as completed after the booking date.", constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                booking.isComplete = true;
                booking.status = "Completed";
            }
            console.log("booking", booking);
            yield this._bookingRepository.update({ bookingId }, booking);
        });
    }
};
exports.UpdateBookingStatusUseCase = UpdateBookingStatusUseCase;
exports.UpdateBookingStatusUseCase = UpdateBookingStatusUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("IEmailService")),
    __metadata("design:paramtypes", [Object, Object])
], UpdateBookingStatusUseCase);
//# sourceMappingURL=update-booking-status.usecase.js.map