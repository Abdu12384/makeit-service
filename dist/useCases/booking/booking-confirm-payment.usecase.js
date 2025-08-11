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
exports.ConfirmPaymentUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
let ConfirmPaymentUseCase = class ConfirmPaymentUseCase {
    constructor(_bookingRepository, _stripeService, _paymentRepository, _redisTokenRepository) {
        this._bookingRepository = _bookingRepository;
        this._stripeService = _stripeService;
        this._paymentRepository = _paymentRepository;
        this._redisTokenRepository = _redisTokenRepository;
    }
    confirmPayment(paymentIntentId, booking) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const paymentIntent = yield this._stripeService.confirmPayment(paymentIntentId);
            if (!paymentIntent)
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.STRIPE_PAYMENT_FAILED, constants_1.HTTP_STATUS.BAD_REQUEST);
            const existingBooking = yield this._bookingRepository.findOne({ bookingId: booking.bookingId });
            if (!existingBooking) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const paidAmount = paymentIntent.amount / 100;
            const balanceAmount = (_a = existingBooking.balanceAmount) !== null && _a !== void 0 ? _a : 0;
            if (paymentIntent.status === "succeeded") {
                if (balanceAmount > 0 && paidAmount >= balanceAmount) {
                    yield this._bookingRepository.update({ bookingId: booking.bookingId }, { paymentStatus: "Successfull", balanceAmount: 0 });
                }
                else {
                    const newBalance = existingBooking === null || existingBooking === void 0 ? void 0 : existingBooking.balanceAmount;
                    yield this._bookingRepository.update({ bookingId: booking.bookingId }, { balanceAmount: newBalance > 0 ? newBalance : 0 });
                }
                yield this._paymentRepository.update({ bookingId: booking.bookingId }, { status: "success" });
            }
            else {
                yield this._paymentRepository.update({ bookingId: booking.bookingId }, { status: "failed" });
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.STRIPE_PAYMENT_FAILED, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            yield this._redisTokenRepository.deleteEventLock(booking.clientId, booking.serviceId);
        });
    }
};
exports.ConfirmPaymentUseCase = ConfirmPaymentUseCase;
exports.ConfirmPaymentUseCase = ConfirmPaymentUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("IPaymentService")),
    __param(2, (0, tsyringe_1.inject)("IPaymentRepository")),
    __param(3, (0, tsyringe_1.inject)("IRedisTokenRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ConfirmPaymentUseCase);
//# sourceMappingURL=booking-confirm-payment.usecase.js.map