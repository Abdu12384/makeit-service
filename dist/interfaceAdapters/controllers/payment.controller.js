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
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { HTTP_STATUS } from "../../shared/constants.js";
let PaymentController = class PaymentController {
    _createBookingPaymentUseCase;
    _confirmPayment;
    constructor(_createBookingPaymentUseCase, _confirmPayment) {
        this._createBookingPaymentUseCase = _createBookingPaymentUseCase;
        this._confirmPayment = _confirmPayment;
    }
    // ══════════════════════════════════════════════════════════
    //  Handle Booking Payment 
    // ══════════════════════════════════════════════════════════
    async handleBookingPayment(req, res) {
        try {
            const { bookingId, paymentIntentId } = req.body;
            const { clientStripeId, booking } = await this._createBookingPaymentUseCase.confirmPayment(paymentIntentId, bookingId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                clientStripeId,
                booking,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Confirm Payment 
    // ══════════════════════════════════════════════════════════
    async confirmPayment(req, res) {
        try {
            const { booking, paymentIntentId } = req.body;
            const confirmPayment = await this._confirmPayment.confirmPayment(paymentIntentId, booking);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Payment Confirmed"
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
PaymentController = __decorate([
    injectable(),
    __param(0, inject("IBookingPaymentUseCase")),
    __param(1, inject("IBookingConfirmPaymentUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], PaymentController);
export { PaymentController };
//# sourceMappingURL=payment.controller.js.map