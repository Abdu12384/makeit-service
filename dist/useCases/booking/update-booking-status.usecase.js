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
const notification_1 = require("../../shared/dtos/notification");
let UpdateBookingStatusUseCase = class UpdateBookingStatusUseCase {
    constructor(_bookingRepository, _mailService, _pushNotificationService, _serviceRepository, _walletRepository, _transactionRepository, _vendorRepository) {
        this._bookingRepository = _bookingRepository;
        this._mailService = _mailService;
        this._pushNotificationService = _pushNotificationService;
        this._serviceRepository = _serviceRepository;
        this._walletRepository = _walletRepository;
        this._transactionRepository = _transactionRepository;
        this._vendorRepository = _vendorRepository;
    }
    execute(bookingId, status, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this._bookingRepository.findOne({ bookingId });
            if (!booking) {
                throw new Error("Booking not found");
            }
            if (status === "Cancelled" && booking.paymentStatus === "AdvancePaid") {
                const service = yield this._serviceRepository.findOne({ serviceId: booking.serviceId });
                if (!service)
                    throw new Error("Service not found");
                const totalAmount = service.servicePrice;
                const advanceAmount = Math.round(totalAmount * 0.3);
                let refundAmount = 0;
                if (booking.paymentStatus === "AdvancePaid") {
                    refundAmount = advanceAmount;
                }
                else if (booking.paymentStatus === "Successfull") {
                    refundAmount = totalAmount;
                }
                booking.status = "Cancelled";
                booking.paymentStatus = "Refunded";
                booking.cancellationReason = reason;
                const vendor = yield this._vendorRepository.VendorfindOne(booking.vendorId);
                if (!vendor)
                    throw new Error("Vendor not found");
                if (!Array.isArray(vendor.bookedDates)) {
                    vendor.bookedDates = [];
                }
                const oldIndex = vendor.bookedDates.findIndex((entry) => new Date(entry.date).toDateString() === new Date(booking.date[0]).toDateString());
                if (oldIndex !== -1) {
                    vendor.bookedDates[oldIndex].count -= 1;
                    if (vendor.bookedDates[oldIndex].count <= 0) {
                        vendor.bookedDates.splice(oldIndex, 1);
                    }
                }
                yield this._vendorRepository.vendorSave(vendor);
                if (refundAmount > 0) {
                    const clientWallet = yield this._walletRepository.updateWallet(booking.clientId, refundAmount);
                    const vendorWallet = yield this._walletRepository.reduceMoney(booking.vendorId, refundAmount);
                    const clientTransaction = {
                        amount: refundAmount,
                        currency: "INR",
                        paymentStatus: "credit",
                        paymentType: "refund",
                        walletId: clientWallet === null || clientWallet === void 0 ? void 0 : clientWallet.walletId,
                        relatedTitle: `Refund from: ${(service === null || service === void 0 ? void 0 : service.serviceTitle) || "a transaction"}`
                    };
                    const vendorTransaction = {
                        amount: refundAmount,
                        currency: "INR",
                        paymentStatus: "debit",
                        paymentType: "refund",
                        walletId: vendorWallet === null || vendorWallet === void 0 ? void 0 : vendorWallet.walletId,
                        relatedTitle: `Refund to client for: ${(service === null || service === void 0 ? void 0 : service.serviceTitle) || "a transaction"}`
                    };
                    yield this._transactionRepository.save(clientTransaction);
                    yield this._transactionRepository.save(vendorTransaction);
                }
                this._mailService.sendCustomEmail(booking.email, "Booking Cancelled", `Your booking has been cancelled. Reason: ${reason || "No reason provided."}`);
                const clientMessage = refundAmount > 0
                    ? `Your booking has been cancelled and ₹${refundAmount} has been refunded to your wallet.`
                    : `Your booking has been cancelled successfully.`;
                yield this._pushNotificationService.sendNotification(booking.clientId, "booking", clientMessage, notification_1.NotificationType.BOOKING_CANCELLED, "client");
                yield this._pushNotificationService.sendNotification(booking.vendorId, "booking", clientMessage, notification_1.NotificationType.BOOKING_CANCELLED, "vendor");
            }
            else if (status === "Cancelled") {
                booking.status = "Cancelled";
                booking.cancellationReason = reason;
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
                yield this._pushNotificationService.sendNotification(booking.clientId, "booking", `Your booking has been approved. Please make the advance payment of ₹${booking.balanceAmount} to complete the booking.`, notification_1.NotificationType.BOOKING_APPROVED, "client");
            }
            else if (status === "Rejected") {
                booking.vendorApproval = "Rejected";
                booking.status = "Rejected";
                booking.rejectionReason = reason;
                yield this._mailService.sendCustomEmail(booking.email, "Booking Rejected", `Your booking has been rejected. Reason: ${reason || "No reason provided."}`);
                yield this._pushNotificationService.sendNotification(booking.clientId, "booking", `Your booking has been rejected. Reason: ${reason || "No reason provided."}`, notification_1.NotificationType.BOOKING_REJECTED, "client");
            }
            else if (status === "Completed") {
                const today = new Date();
                const bookingDate = new Date(booking.date[0]);
                if (bookingDate > today) {
                    throw new custom_error_1.CustomError("You can only mark this booking as completed after the booking date.", constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                booking.isComplete = true;
                booking.status = "Completed";
                const vendor = yield this._vendorRepository.VendorfindOne(booking.vendorId);
                if (!vendor) {
                    throw new Error("Vendor not found.");
                }
                if (!Array.isArray(vendor.bookedDates)) {
                    vendor.bookedDates = [];
                }
                const index = vendor.bookedDates.findIndex((entry) => new Date(entry.date).toDateString() === new Date(booking.date[0]).toDateString());
                if (index !== -1) {
                    vendor.bookedDates[index].count -= 1;
                    if (vendor.bookedDates[index].count <= 0) {
                        vendor.bookedDates.splice(index, 1);
                    }
                }
                yield this._vendorRepository.vendorSave(vendor);
                yield this._pushNotificationService.sendNotification(booking.clientId, "booking", `Your booking has been completed.`, notification_1.NotificationType.BOOKING_COMPLETED, "client");
            }
            yield this._bookingRepository.update({ bookingId }, booking);
        });
    }
};
exports.UpdateBookingStatusUseCase = UpdateBookingStatusUseCase;
exports.UpdateBookingStatusUseCase = UpdateBookingStatusUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("IEmailService")),
    __param(2, (0, tsyringe_1.inject)("IPushNotificationService")),
    __param(3, (0, tsyringe_1.inject)("IServiceRepository")),
    __param(4, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(5, (0, tsyringe_1.inject)("ITransactionRepository")),
    __param(6, (0, tsyringe_1.inject)("IVendorRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], UpdateBookingStatusUseCase);
//# sourceMappingURL=update-booking-status.usecase.js.map