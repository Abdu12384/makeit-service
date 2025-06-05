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
let ConfirmPaymentUseCase = class ConfirmPaymentUseCase {
    _bookingRepository;
    _stripeService;
    _paymentRepository;
    constructor(_bookingRepository, _stripeService, _paymentRepository) {
        this._bookingRepository = _bookingRepository;
        this._stripeService = _stripeService;
        this._paymentRepository = _paymentRepository;
    }
    async confirmPayment(paymentIntentId, booking) {
        const paymentIntent = await this._stripeService.confirmPayment(paymentIntentId);
        if (!paymentIntent)
            throw new Error("Failed to confirm Stripe payment");
        console.log("paymentIntent", paymentIntent);
        if (paymentIntent.status === "succeeded") {
            await this._bookingRepository.update({ bookingId: booking }, { paymentStatus: "Successfull" });
            await this._paymentRepository.update({ bookingId: booking }, { status: "success" });
        }
        else {
            await this._bookingRepository.update({ bookingId: booking }, { paymentStatus: "Failed" });
            await this._paymentRepository.update({ bookingId: booking }, { status: "failed" });
            throw new Error("Stripe payment not successful");
        }
    }
};
ConfirmPaymentUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IPaymentService")),
    __param(2, inject("IPaymentRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], ConfirmPaymentUseCase);
export { ConfirmPaymentUseCase };
//# sourceMappingURL=booking-confirm-payment.usecase.js.map