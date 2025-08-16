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
exports.WalletPaymentUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
let WalletPaymentUseCase = class WalletPaymentUseCase {
    constructor(_walletRepository, _eventRepository, _qrService, _ticketRepository, _transactionRepository) {
        this._walletRepository = _walletRepository;
        this._eventRepository = _eventRepository;
        this._qrService = _qrService;
        this._ticketRepository = _ticketRepository;
        this._transactionRepository = _transactionRepository;
    }
    execute(ticket, amount, eventId, type, totalTicketCount, vendorId, clientId, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventDetails = yield this._eventRepository.findOne({ eventId });
            if (!eventDetails) {
                throw new custom_error_1.CustomError("Event not found", constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (eventDetails.status === "cancelled")
                throw new custom_error_1.CustomError("Event cancelled", constants_1.HTTP_STATUS.FORBIDDEN);
            if (eventDetails.status === "completed")
                throw new custom_error_1.CustomError("Event already completed", constants_1.HTTP_STATUS.FORBIDDEN);
            if ((eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) && (eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) === eventDetails.totalTicket)
                throw new custom_error_1.CustomError("Ticket Sold Out", constants_1.HTTP_STATUS.FORBIDDEN);
            if ((eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) && (eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) + totalTicketCount > eventDetails.totalTicket)
                throw new custom_error_1.CustomError(`Only ${eventDetails.totalTicket - eventDetails.ticketPurchased} tickets are available. Please reduce the quantity.`, constants_1.HTTP_STATUS.FORBIDDEN);
            const wallet = yield this._walletRepository.findOne({ userId: clientId });
            if (!wallet) {
                throw new custom_error_1.CustomError("Wallet not found", constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (wallet.balance < amount) {
                throw new custom_error_1.CustomError("Insufficient wallet balance", constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            wallet.balance -= amount;
            yield this._walletRepository.reduceMoney(clientId, amount);
            const clientTransactionDetails = {
                amount: amount,
                currency: "INR",
                paymentStatus: "debit",
                paymentType: "ticketBooking",
                walletId: wallet.walletId,
                relatedTitle: `Ticket: ${(eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.title) || "an event"}`
            };
            yield this._transactionRepository.save(clientTransactionDetails);
            const vendorWallet = yield this._walletRepository.findOne({ userId: vendorId });
            if (!vendorWallet) {
                throw new custom_error_1.CustomError("Vendor wallet not found", constants_1.HTTP_STATUS.NOT_FOUND);
            }
            vendorWallet.balance += amount;
            yield this._walletRepository.updateWallet(vendorId, amount);
            const vendorTransactionDetails = {
                amount: amount,
                currency: "INR",
                paymentStatus: "credit",
                paymentType: "ticketBooking",
                walletId: vendorWallet.walletId,
                relatedTitle: `Ticket: ${(eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.title) || "an event"}`
            };
            yield this._transactionRepository.save(vendorTransactionDetails);
            const HOSTNAME = process.env.HOSTNAME;
            const ticketId = (0, unique_uuid_helper_1.generateUniqueId)();
            const qrLink = `${HOSTNAME}/verify-ticket/${ticketId}/${eventDetails.eventId}`;
            const qrCode = yield this._qrService.generateQRCode(qrLink);
            if (!qrCode) {
                throw new custom_error_1.CustomError("QR Code generation failed", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            let attendeesCount = (eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) || 0;
            attendeesCount += totalTicketCount;
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
                email: ticket.email,
                phone: ticket.phone,
                eventId: ticket.eventId,
                ticketId: ticketId,
                qrCodeLink: qrCode,
                clientId: clientId,
                paymentStatus: "successfull",
                ticketStatus: "unused",
                ticketCount: totalTicketCount,
                totalAmount: amount,
                // paymentTransactionId: paymentDocument.paymentId,
                vendorId: vendorId,
            };
            const createdTicket = yield this._ticketRepository.save(ogTicket);
            if (!createdTicket) {
                throw new custom_error_1.CustomError("Error while saving ticket details", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            return createdTicket;
        });
    }
};
exports.WalletPaymentUseCase = WalletPaymentUseCase;
exports.WalletPaymentUseCase = WalletPaymentUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(1, (0, tsyringe_1.inject)("IEventRepository")),
    __param(2, (0, tsyringe_1.inject)("IQRService")),
    __param(3, (0, tsyringe_1.inject)("ITicketRepository")),
    __param(4, (0, tsyringe_1.inject)("ITransactionRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], WalletPaymentUseCase);
//# sourceMappingURL=wallet-payment.usecase.js.map