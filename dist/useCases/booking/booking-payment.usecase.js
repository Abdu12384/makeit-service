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
let BookingPaymentUseCase = class BookingPaymentUseCase {
    _bookingRepository;
    _serviceRepository;
    _paymentService;
    _paymentRepository;
    constructor(_bookingRepository, _serviceRepository, _paymentService, _paymentRepository) {
        this._bookingRepository = _bookingRepository;
        this._serviceRepository = _serviceRepository;
        this._paymentService = _paymentService;
        this._paymentRepository = _paymentRepository;
    }
    async confirmPayment(paymentIntentId, bookingId) {
        const booking = await this._bookingRepository.findOne({ bookingId });
        console.log("booking", booking);
        if (!booking)
            throw new Error("Booking not found");
        if (booking.status != 'Completed')
            throw new Error('This Booking is not completed');
        if (booking.paymentStatus == "Successfull")
            throw new Error('This booking is Already paid');
        const service = await this._serviceRepository.findOne({ serviceId: booking.serviceId });
        if (!service) {
            throw new Error("Service not found");
        }
        const totalAmount = service.servicePrice;
        const clientStripeId = await this._paymentService.createPaymentIntent(totalAmount, "service", { bookingId });
        const payment = await this._paymentRepository.save({
            clientId: booking.clientId,
            receiverId: service?.vendorId,
            bookingId: booking.bookingId,
            amount: totalAmount,
            currency: "INR",
            purpose: "serviceBooking",
            status: "pending",
            paymentId: paymentIntentId
        });
        console.log("payment", payment);
        return { booking, clientStripeId };
    }
};
BookingPaymentUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IServiceRepository")),
    __param(2, inject("IPaymentService")),
    __param(3, inject("IPaymentRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], BookingPaymentUseCase);
export { BookingPaymentUseCase };
//# sourceMappingURL=booking-payment.usecase.js.map