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
let BookingPaymentUseCase = class BookingPaymentUseCase {
    constructor(_bookingRepository, _serviceRepository, _paymentService, _paymentRepository) {
        this._bookingRepository = _bookingRepository;
        this._serviceRepository = _serviceRepository;
        this._paymentService = _paymentService;
        this._paymentRepository = _paymentRepository;
    }
    confirmPayment(paymentIntentId, bookingId, bookingDetails, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            let booking = yield this._bookingRepository.findOne({ bookingId });
            console.log("booking", booking);
            let serviceId = (booking === null || booking === void 0 ? void 0 : booking.serviceId) || bookingDetails.serviceId;
            const service = yield this._serviceRepository.findOne({ serviceId });
            const totalAmount = service === null || service === void 0 ? void 0 : service.servicePrice;
            const advanceAmount = Math.round(totalAmount * 0.3);
            const balanceAmount = totalAmount - advanceAmount;
            let amountToPay;
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
                    yield this._bookingRepository.updateOne({ bookingId: booking.bookingId }, {
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
            console.log("amountToPay", amountToPay);
            const clientStripeId = yield this._paymentService.createPaymentIntent(amountToPay, "service", { bookingId });
            const payment = yield this._paymentRepository.save({
                clientId: booking.clientId,
                receiverId: service === null || service === void 0 ? void 0 : service.vendorId,
                bookingId: booking.bookingId,
                amount: amountToPay,
                currency: "INR",
                purpose: "serviceBooking",
                status: "pending",
                paymentId: paymentIntentId,
            });
            console.log("payment", payment);
            return { booking, clientStripeId };
        });
    }
};
exports.BookingPaymentUseCase = BookingPaymentUseCase;
exports.BookingPaymentUseCase = BookingPaymentUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("IServiceRepository")),
    __param(2, (0, tsyringe_1.inject)("IPaymentService")),
    __param(3, (0, tsyringe_1.inject)("IPaymentRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], BookingPaymentUseCase);
//# sourceMappingURL=booking-payment.usecase.js.map