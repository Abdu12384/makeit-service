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
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
const constants_2 = require("../../shared/constants");
let CancelTicketUseCase = class CancelTicketUseCase {
    constructor(_ticketRepository, _transactionRepository, _walletRepository, _eventRepository, _pushNotificationService) {
        this._ticketRepository = _ticketRepository;
        this._transactionRepository = _transactionRepository;
        this._walletRepository = _walletRepository;
        this._eventRepository = _eventRepository;
        this._pushNotificationService = _pushNotificationService;
    }
    execute(ticketId, cancelCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield this._ticketRepository.findOneWithPopulate({
                ticketId,
            });
            if (!ticket) {
                throw new custom_error_1.CustomError("Ticket not found", constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (ticket.ticketStatus === "refunded") {
                throw new custom_error_1.CustomError("Ticket already refunded", constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const totalCount = ticket.ticketCount;
            if (cancelCount > totalCount) {
                throw new custom_error_1.CustomError("Cancel count exceeds total ticket count", constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const singleTicketAmount = ticket.totalAmount / totalCount;
            const cancelAmount = singleTicketAmount * cancelCount;
            // Platform keeps 10%
            const platformFee = cancelAmount * 0.1;
            // Vendor's share (to be deducted)
            const vendorShare = cancelAmount * 0.29;
            // Refundable to client
            const clientRefund = cancelAmount - platformFee - vendorShare;
            const eventDetails = yield this._eventRepository.findOne({
                eventId: ticket.eventId,
            });
            /** Step 1: Refund to client */
            const clientWallet = yield this._walletRepository.updateWallet(ticket.clientId, clientRefund);
            if (!clientWallet) {
                throw new custom_error_1.CustomError("Failed to update client wallet", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            const clientTransaction = {
                amount: clientRefund,
                currency: "INR",
                paymentStatus: "credit",
                paymentType: "refund",
                walletId: clientWallet.walletId,
                relatedTitle: `Ticket Refund: ${(eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.title) || "an event"}`
            };
            const savedClientTx = yield this._transactionRepository.save(clientTransaction);
            if (!savedClientTx) {
                throw new custom_error_1.CustomError("Failed to log client transaction", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            /** Step 2: Deduct from vendor */
            const vendorId = ticket.vendorId;
            const vendorWallet = yield this._walletRepository.reduceMoney(vendorId, vendorShare);
            if (!vendorWallet) {
                throw new custom_error_1.CustomError("Failed to deduct vendor wallet", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            const vendorTransaction = {
                amount: vendorShare,
                currency: "INR",
                paymentStatus: "debit",
                paymentType: "refund",
                walletId: vendorWallet.walletId,
                relatedTitle: `Refund for: ${(eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.title) || "an event"}`,
            };
            const savedVendorTx = yield this._transactionRepository.save(vendorTransaction);
            if (!savedVendorTx) {
                throw new custom_error_1.CustomError("Failed to log vendor transaction", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            ticket.totalAmount = ticket.totalAmount - cancelAmount;
            ticket.ticketCount = totalCount - cancelCount;
            if (ticket.ticketCount === 0) {
                ticket.ticketStatus = "cancelled";
                ticket.checkedIn = "cancelled";
                if ((eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.attendees) && Array.isArray(eventDetails.attendees)) {
                    eventDetails.attendees = eventDetails.attendees.filter((attendeeId) => attendeeId !== ticket.clientId);
                }
            }
            else {
                ticket.ticketStatus = "partially_refunded";
            }
            if (!ticket.cancellationHistory) {
                ticket.cancellationHistory = [];
            }
            ticket.cancellationHistory.push({
                count: cancelCount,
                amount: cancelAmount,
                date: new Date(),
            });
            if (!eventDetails) {
                throw new custom_error_1.CustomError("Event not found", constants_1.HTTP_STATUS.NOT_FOUND);
            }
            eventDetails.ticketPurchased = Math.max(0, eventDetails.ticketPurchased - cancelCount);
            eventDetails.attendeesCount = Math.max(0, eventDetails.attendeesCount - cancelCount);
            eventDetails.checkedInCount =
                Math.max(0, eventDetails.checkedInCount - cancelCount) || 0;
            yield this._eventRepository.update({ eventId: ticket.eventId }, eventDetails);
            yield this._pushNotificationService.sendNotification(ticket.clientId, "Ticket Cancelled", `Your booking for ${(eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.title) || "an event"} has been cancelled.`, constants_2.NotificationType.TICKET_BOOKING, "client");
            yield this._pushNotificationService.sendNotification(vendorId, "A ticket has been cancelled for your event", `${ticket.ticketCount} tickets were cancelled for ${eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.title}.`, constants_2.NotificationType.TICKET_BOOKING, "vendor");
            /** Step 3: Update ticket status */
            yield this._ticketRepository.update({ ticketId }, ticket);
        });
    }
};
CancelTicketUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ITicketRepository")),
    __param(1, (0, tsyringe_1.inject)("ITransactionRepository")),
    __param(2, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(3, (0, tsyringe_1.inject)("IEventRepository")),
    __param(4, (0, tsyringe_1.inject)("IPushNotificationService")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CancelTicketUseCase);
exports.default = CancelTicketUseCase;
//# sourceMappingURL=cancel-ticket.usecase.js.map