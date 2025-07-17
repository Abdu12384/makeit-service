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
exports.PaymentController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const constants_1 = require("../../shared/constants");
let PaymentController = class PaymentController {
    constructor(_createBookingPaymentUseCase, _confirmPayment) {
        this._createBookingPaymentUseCase = _createBookingPaymentUseCase;
        this._confirmPayment = _confirmPayment;
    }
    // ══════════════════════════════════════════════════════════
    //  Handle Booking Payment 
    // ══════════════════════════════════════════════════════════
    handleBookingPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId, paymentIntentId, bookingDetails } = req.body;
                const { userId } = req.user;
                const { clientStripeId, booking } = yield this._createBookingPaymentUseCase.confirmPayment(paymentIntentId, bookingId, bookingDetails, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    clientStripeId,
                    booking,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Confirm Payment 
    // ══════════════════════════════════════════════════════════
    confirmPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { booking, paymentIntentId } = req.body;
                const confirmPayment = yield this._confirmPayment.confirmPayment(paymentIntentId, booking);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: "Payment Confirmed"
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.PaymentController = PaymentController;
exports.PaymentController = PaymentController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingPaymentUseCase")),
    __param(1, (0, tsyringe_1.inject)("IBookingConfirmPaymentUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map