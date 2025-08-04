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
exports.BookingPaymentUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
const notification_1 = require("../../shared/dtos/notification");
const config_1 = require("../../shared/config");
let BookingPaymentUseCase = class BookingPaymentUseCase {
    constructor(_bookingRepository, _vendorRepository, _serviceRepository, _paymentService, _paymentRepository, _transactionRepository, _walletRepository, _pushNotificationService, _redisTokenRepository) {
        this._bookingRepository = _bookingRepository;
        this._vendorRepository = _vendorRepository;
        this._serviceRepository = _serviceRepository;
        this._paymentService = _paymentService;
        this._paymentRepository = _paymentRepository;
        this._transactionRepository = _transactionRepository;
        this._walletRepository = _walletRepository;
        this._pushNotificationService = _pushNotificationService;
        this._redisTokenRepository = _redisTokenRepository;
    }
    confirmPayment(paymentIntentId, bookingId, bookingDetails, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            let booking = yield this._bookingRepository.findOne({ bookingId });
            let vendor = yield this._vendorRepository.findOne({ vendorId: booking === null || booking === void 0 ? void 0 : booking.vendorId });
            let serviceId = (booking === null || booking === void 0 ? void 0 : booking.serviceId) || bookingDetails.serviceId;
            const isLocked = yield this._redisTokenRepository.isEventLocked(clientId, serviceId);
            if (isLocked) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_LOCKED, constants_1.HTTP_STATUS.TOO_MORE_REQUESTS);
            }
            yield this._redisTokenRepository.setEventLock(clientId, serviceId, 600);
            const service = yield this._serviceRepository.findOne({ serviceId });
            const totalAmount = service === null || service === void 0 ? void 0 : service.servicePrice;
            const advanceAmount = Math.round(totalAmount * 0.3);
            const balanceAmount = totalAmount - advanceAmount;
            let amountToPay;
            let vendorShare;
            if (!booking) {
                // New booking → pay advance
                const newBookingId = (0, unique_uuid_helper_1.generateUniqueId)("booking");
                booking = yield this._bookingRepository.save({
                    bookingId: newBookingId,
                    clientId,
                    serviceId: bookingDetails.serviceId,
                    email: bookingDetails.email,
                    phone: bookingDetails.phone,
                    vendorId: bookingDetails.vendorId,
                    date: bookingDetails.date,
                    status: "Pending",
                    paymentStatus: "AdvancePaid",
                    vendorApproval: "Pending",
                    balanceAmount: balanceAmount,
                });
                amountToPay = advanceAmount;
                vendorShare = advanceAmount;
            }
            else {
                if (booking.paymentStatus === "Successfull") {
                    throw new Error("This booking is already fully paid.");
                }
                if (booking.paymentStatus === "Pending") {
                    // First advance payment for existing booking
                    amountToPay = advanceAmount;
                    vendorShare = amountToPay;
                    yield this._bookingRepository.updateOne({ bookingId: booking.bookingId }, {
                        $set: {
                            paymentStatus: "AdvancePaid",
                            balanceAmount: balanceAmount,
                            status: "Confirmed",
                        },
                    });
                    let vendor = yield this._vendorRepository.VendorfindOne(booking === null || booking === void 0 ? void 0 : booking.vendorId);
                    if (!vendor) {
                        throw new Error("Vendor not found");
                    }
                    if (!Array.isArray(vendor.bookedDates)) {
                        vendor.bookedDates = [{ date: new Date(booking.date[0]), count: 0 }];
                    }
                    const index = vendor === null || vendor === void 0 ? void 0 : vendor.bookedDates.findIndex(entry => new Date(entry.date).toDateString() === new Date(booking.date[0]).toDateString());
                    if (index !== -1) {
                        vendor.bookedDates[index].count += 1;
                    }
                    else {
                        vendor.bookedDates.push({
                            date: new Date(booking.date[0]),
                            count: 1
                        });
                    }
                    yield this._vendorRepository.vendorSave(vendor);
                }
                else if (booking.paymentStatus === "AdvancePaid") {
                    // Balance payment
                    if (!booking.balanceAmount || booking.balanceAmount <= 0) {
                        throw new Error("No balance amount available to pay.");
                    }
                    const fullBalannceAmount = booking.balanceAmount;
                    const platformFee = Math.round(fullBalannceAmount * 0.1);
                    let adminId = config_1.config.adminId;
                    let adminWallet = yield this._walletRepository.findOne({ userId: adminId });
                    amountToPay = booking.balanceAmount;
                    vendorShare = fullBalannceAmount - platformFee;
                    const adminCommission = {
                        amount: platformFee,
                        currency: "INR",
                        paymentStatus: "credit",
                        paymentType: "adminCommission",
                        walletId: adminWallet === null || adminWallet === void 0 ? void 0 : adminWallet.walletId,
                        relatedTitle: `Admin Commission from Service Booking: ${(service === null || service === void 0 ? void 0 : service.serviceTitle) || "a service"}`,
                    };
                    const adminCommissionTransaction = yield this._transactionRepository.save(adminCommission);
                    const addMoneyToAdminWallet = yield this._walletRepository.updateWallet(adminWallet === null || adminWallet === void 0 ? void 0 : adminWallet.walletId, platformFee);
                    yield this._bookingRepository.updateOne({ bookingId: booking.bookingId }, {
                        $set: {
                            paymentStatus: "Successfull",
                            balanceAmount: 0,
                        },
                    });
                }
                else {
                    throw new Error("Invalid payment status.");
                }
            }
            const clientStripeId = yield this._paymentService.createPaymentIntent(amountToPay, "service", { bookingId });
            const wallet = yield this._walletRepository.findOne({ userId: booking.vendorId });
            if (!wallet) {
                throw new custom_error_1.CustomError("Wallet not found", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            const vendorTransactionDetails = {
                amount: vendorShare,
                currency: "INR",
                paymentStatus: "credit",
                paymentType: "serviceBooking",
                walletId: wallet === null || wallet === void 0 ? void 0 : wallet.walletId,
                relatedTitle: `Service Booking: ${(service === null || service === void 0 ? void 0 : service.serviceTitle) || "a service"}`,
            };
            const vendorTransaction = yield this._transactionRepository.save(vendorTransactionDetails);
            const addMoneyToVendorWallet = yield this._walletRepository.updateWallet(booking.vendorId, vendorShare);
            yield this._pushNotificationService.sendNotification(booking.clientId, "Booking Confirmed", `Your advance payment for ${service === null || service === void 0 ? void 0 : service.serviceTitle} is successful.`, notification_1.NotificationType.BOOKIG_ADVANCE_PAYMENT, "client");
            yield this._pushNotificationService.sendNotification(booking.vendorId, "Advance Payment Received", `You have received advance payment for ${service === null || service === void 0 ? void 0 : service.serviceTitle}.`, notification_1.NotificationType.BOOKIG_ADVANCE_PAYMENT, "vendor");
            return { booking, clientStripeId };
        });
    }
};
exports.BookingPaymentUseCase = BookingPaymentUseCase;
exports.BookingPaymentUseCase = BookingPaymentUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("IVendorRepository")),
    __param(2, (0, tsyringe_1.inject)("IServiceRepository")),
    __param(3, (0, tsyringe_1.inject)("IPaymentService")),
    __param(4, (0, tsyringe_1.inject)("IPaymentRepository")),
    __param(5, (0, tsyringe_1.inject)("ITransactionRepository")),
    __param(6, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(7, (0, tsyringe_1.inject)("IPushNotificationService")),
    __param(8, (0, tsyringe_1.inject)("IRedisTokenRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], BookingPaymentUseCase);
//# sourceMappingURL=booking-payment.usecase.js.map