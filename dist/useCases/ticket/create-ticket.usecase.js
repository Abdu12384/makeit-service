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
exports.CreateTicketUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
let CreateTicketUseCase = class CreateTicketUseCase {
    constructor(_eventRepository, _qrService, _stripeService, _paymentRepository, _ticketRepository, _redisTokenRepository) {
        this._eventRepository = _eventRepository;
        this._qrService = _qrService;
        this._stripeService = _stripeService;
        this._paymentRepository = _paymentRepository;
        this._ticketRepository = _ticketRepository;
        this._redisTokenRepository = _redisTokenRepository;
    }
    execute(ticket, paymentIntentId, totalAmount, totalCount, vendorId, clientId, eventId, email, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventDetails = yield this._eventRepository.findOne({ eventId });
            if (!eventDetails) {
                throw new custom_error_1.CustomError("Event not found", constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const isLocked = yield this._redisTokenRepository.isEventLocked(clientId, eventId);
            if (isLocked) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.EVENT_LOCKED, constants_1.HTTP_STATUS.TOO_MORE_REQUESTS);
            }
            yield this._redisTokenRepository.setEventLock(clientId, eventId, 600);
            if (eventDetails.status === "cancelled")
                throw new custom_error_1.CustomError("Event cancelled", constants_1.HTTP_STATUS.FORBIDDEN);
            if (eventDetails.status === "completed")
                throw new custom_error_1.CustomError("Event already completed", constants_1.HTTP_STATUS.FORBIDDEN);
            if ((eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) && (eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) === eventDetails.totalTicket)
                throw new custom_error_1.CustomError("Ticket Sold Out", constants_1.HTTP_STATUS.FORBIDDEN);
            if ((eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) && (eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) + totalCount > eventDetails.totalTicket)
                throw new custom_error_1.CustomError(`Only ${eventDetails.totalTicket - eventDetails.ticketPurchased} tickets are available. Please reduce the quantity.`, constants_1.HTTP_STATUS.FORBIDDEN);
            const HOSTNAME = process.env.HOSTNAME;
            const ticketId = (0, unique_uuid_helper_1.generateUniqueId)();
            const qrLink = `${HOSTNAME}/verify-ticket/${ticketId}/${eventId}`;
            const qrCode = yield this._qrService.generateQRCode(qrLink);
            if (!qrCode) {
                throw new custom_error_1.CustomError("QR Code generation failed", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            const clientStripeId = yield this._stripeService.createPaymentIntent(totalAmount, "ticket", { ticket: ticket });
            if (!clientStripeId) {
                throw new custom_error_1.CustomError("Error while creating stripe client id", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            const paymentDetails = {
                amount: totalAmount,
                currency: "INR",
                paymentId: paymentIntentId,
                receiverId: vendorId,
                purpose: "ticketBooking",
                status: "pending",
                clientId: clientId,
                ticketId: ticketId,
            };
            const paymentDocument = yield this._paymentRepository.save(paymentDetails);
            if (!paymentDocument) {
                throw new custom_error_1.CustomError("Error while saving payment details", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            let attendeesCount = (eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) || 0;
            attendeesCount += totalCount;
            const currentAttendees = eventDetails.attendees || [];
            if (!currentAttendees.includes(clientId)) {
                currentAttendees.push(clientId);
            }
            const eventUpdate = {
                attendeesCount,
                attendees: currentAttendees
            };
            yield this._eventRepository.update({ eventId: eventDetails.eventId }, eventUpdate);
            const ogTicket = {
                email,
                phone,
                eventId,
                ticketId: ticketId,
                qrCodeLink: qrCode,
                clientId: clientId,
                paymentStatus: "pending",
                ticketStatus: "unused",
                ticketCount: totalCount,
                totalAmount: totalAmount,
                paymentTransactionId: paymentDocument.paymentId,
                vendorId: vendorId,
            };
            const createdTicket = yield this._ticketRepository.save(ogTicket);
            if (!createdTicket) {
                throw new custom_error_1.CustomError("Error while saving ticket details", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            return { stripeClientId: clientStripeId, createdTicket };
        });
    }
};
exports.CreateTicketUseCase = CreateTicketUseCase;
exports.CreateTicketUseCase = CreateTicketUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IEventRepository")),
    __param(1, (0, tsyringe_1.inject)("IQRService")),
    __param(2, (0, tsyringe_1.inject)("IPaymentService")),
    __param(3, (0, tsyringe_1.inject)("IPaymentRepository")),
    __param(4, (0, tsyringe_1.inject)("ITicketRepository")),
    __param(5, (0, tsyringe_1.inject)("IRedisTokenRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], CreateTicketUseCase);
//# sourceMappingURL=create-ticket.usecase.js.map