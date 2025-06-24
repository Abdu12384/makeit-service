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
exports.ConfirmTicketUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
const notification_1 = require("../../shared/dtos/notification");
let ConfirmTicketUseCase = class ConfirmTicketUseCase {
    constructor(_stripeService, _eventRepository, _ticketRepository, _transactionRepository, _paymentRepository, _walletRepository, _pushNotificationService) {
        this._stripeService = _stripeService;
        this._eventRepository = _eventRepository;
        this._ticketRepository = _ticketRepository;
        this._transactionRepository = _transactionRepository;
        this._paymentRepository = _paymentRepository;
        this._walletRepository = _walletRepository;
        this._pushNotificationService = _pushNotificationService;
    }
    execute(ticket, paymentIntentId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmPayment = yield this._stripeService.confirmPayment(paymentIntentId);
            if (!confirmPayment) {
                throw new custom_error_1.CustomError("Error while confirming payment", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            const eventDetails = yield this._eventRepository.findOne({ eventId: ticket.eventId });
            console.log('eventDetails', eventDetails);
            //   if (eventDetails?.ticketPurchased > eventDetails?.totalTicket) {
            //     throw new CustomError('Ticket full Sold out',HTTP_STATUS.FORBIDDEN)
            // } else if (eventDetails?.ticketPurchased + ticket.ticketCount > eventDetails?.totalTicket) {
            //     throw new CustomError('Not enough ticket available',HTTP_STATUS.FORBIDDEN)
            // }
            const paymentDetails = yield this._paymentRepository.update({ paymentId: paymentIntentId }, { status: "success" });
            const newTicketPurchased = ((eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.ticketPurchased) || 0) + ticket.ticketCount;
            console.log('newTicketPurchased', newTicketPurchased);
            const updateTicketCount = yield this._eventRepository.update({ eventId: ticket.eventId }, { ticketPurchased: newTicketPurchased });
            const updatedTicket = yield this._ticketRepository.update({ ticketId: ticket.ticketId }, { paymentStatus: "successfull" });
            const adminId = process.env.ADMIN_ID;
            if (!adminId)
                throw new custom_error_1.CustomError("Admin ID not found", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            const adminCommission = ticket.totalAmount * 0.1;
            const vendorPrice = ticket.totalAmount - adminCommission;
            const adminWalletId = yield this._walletRepository.findOne({ userId: adminId });
            if (!adminWalletId) {
                throw new custom_error_1.CustomError("Admin wallet not found", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            //  const adminWallet = await this._walletRepository.findOne({walletId:adminId})
            //  if(!adminWallet){throw new CustomError("Admin wallet not found",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
            const adminTransaction = {
                amount: adminCommission,
                currency: "INR",
                paymentStatus: "credit",
                paymentType: "adminCommission",
                walletId: adminWalletId === null || adminWalletId === void 0 ? void 0 : adminWalletId.walletId,
            };
            const transaction = yield this._transactionRepository.save(adminTransaction);
            const adminWalletAddMoney = yield this._walletRepository.updateWallet(adminId, adminCommission);
            const vendorWallet = yield this._walletRepository.findOne({ userId: vendorId });
            let vendorWalletId;
            if (vendorWallet) {
                vendorWalletId = vendorWallet.walletId;
            }
            else {
                vendorWalletId = (0, unique_uuid_helper_1.generateUniqueId)("wallet");
                const newVendorWallet = {
                    walletId: vendorWalletId,
                    userId: vendorId,
                    balance: 0,
                    userModel: "vendors",
                };
                const vendorWallet = yield this._walletRepository.save(newVendorWallet);
                if (!vendorWallet) {
                    throw new custom_error_1.CustomError("Vendor wallet not found", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
                }
                vendorWalletId = vendorWallet.walletId;
            }
            const vendorTransactionDetails = {
                amount: vendorPrice,
                currency: "INR",
                paymentStatus: "credit",
                paymentType: "ticketBooking",
                walletId: vendorWalletId,
            };
            const vendorTransaction = yield this._transactionRepository.save(vendorTransactionDetails);
            const addMoneyToVendorWallet = yield this._walletRepository.updateWallet(vendorId, vendorPrice);
            console.log('transaction', transaction);
            yield this._pushNotificationService.sendNotification(ticket.clientId, "Ticket Booking Confirmed", `Your booking for ${(eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.title) || "an event"} has been confirmed.`, notification_1.NotificationType.TICKET_BOOKING, "client");
            yield this._pushNotificationService.sendNotification(vendorId, "A ticket has been booked for your event", `${ticket.ticketCount} tickets were booked for ${eventDetails === null || eventDetails === void 0 ? void 0 : eventDetails.title}.`, notification_1.NotificationType.TICKET_BOOKING, "vendor");
            return updatedTicket;
        });
    }
};
exports.ConfirmTicketUseCase = ConfirmTicketUseCase;
exports.ConfirmTicketUseCase = ConfirmTicketUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IPaymentService")),
    __param(1, (0, tsyringe_1.inject)("IEventRepository")),
    __param(2, (0, tsyringe_1.inject)("ITicketRepository")),
    __param(3, (0, tsyringe_1.inject)("ITransactionRepository")),
    __param(4, (0, tsyringe_1.inject)("IPaymentRepository")),
    __param(5, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(6, (0, tsyringe_1.inject)("IPushNotificationService")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], ConfirmTicketUseCase);
//# sourceMappingURL=confirm-ticket.usecase.js.map