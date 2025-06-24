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
    async confirmPayment(paymentIntentId, bookingId, bookingDetails, clientId) {
        let booking = await this._bookingRepository.findOne({ bookingId });
        console.log("booking", booking);
        let serviceId = booking?.serviceId || bookingDetails.serviceId;
        const service = await this._serviceRepository.findOne({ serviceId });
        const totalAmount = service?.servicePrice;
        const advanceAmount = Math.round(totalAmount * 0.3);
        const balanceAmount = totalAmount - advanceAmount;
        let amountToPay;
        if (!booking) {
            // New booking → pay advance
            const newBookingId = generateUniqueId("booking");
            booking = await this._bookingRepository.save({
                bookingId: newBookingId,
                clientId,
                serviceId: bookingDetails.serviceId,
                email: bookingDetails.email,
                phone: bookingDetails.phone,
                vendorId: bookingDetails.vendorId,
                date: [bookingDetails.date],
                status: "Pending",
                paymentStatus: "AdvancePaid",
                vendorApproval: "Pending",
                balanceAmount: balanceAmount,
            });
            amountToPay = advanceAmount;
        }
        else {
            if (booking.paymentStatus === "Successfull") {
                throw new Error("This booking is already fully paid.");
            }
            if (booking.paymentStatus === "Pending") {
                // First advance payment for existing booking
                amountToPay = advanceAmount;
                await this._bookingRepository.updateOne({ bookingId: booking.bookingId }, {
                    $set: {
                        paymentStatus: "AdvancePaid",
                        balanceAmount: balanceAmount,
                        status: "Confirmed",
                    },
                });
            }
            else if (booking.paymentStatus === "AdvancePaid") {
                // Balance payment
                if (!booking.balanceAmount || booking.balanceAmount <= 0) {
                    throw new Error("No balance amount available to pay.");
                }
                amountToPay = booking.balanceAmount;
                await this._bookingRepository.updateOne({ bookingId: booking.bookingId }, {
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
        console.log("amountToPay", amountToPay);
        const clientStripeId = await this._paymentService.createPaymentIntent(amountToPay, "service", { bookingId });
        const payment = await this._paymentRepository.save({
            clientId: booking.clientId,
            receiverId: service?.vendorId,
            bookingId: booking.bookingId,
            amount: amountToPay,
            currency: "INR",
            purpose: "serviceBooking",
            status: "pending",
            paymentId: paymentIntentId,
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