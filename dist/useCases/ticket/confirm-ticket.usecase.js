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
import { CustomError } from "../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
let ConfirmTicketUseCase = class ConfirmTicketUseCase {
    _stripeService;
    _eventRepository;
    _ticketRepository;
    _transactionRepository;
    _paymentRepository;
    _walletRepository;
    constructor(_stripeService, _eventRepository, _ticketRepository, _transactionRepository, _paymentRepository, _walletRepository) {
        this._stripeService = _stripeService;
        this._eventRepository = _eventRepository;
        this._ticketRepository = _ticketRepository;
        this._transactionRepository = _transactionRepository;
        this._paymentRepository = _paymentRepository;
        this._walletRepository = _walletRepository;
    }
    async execute(ticket, paymentIntentId, vendorId) {
        const confirmPayment = await this._stripeService.confirmPayment(paymentIntentId);
        if (!confirmPayment) {
            throw new CustomError("Error while confirming payment", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        const eventDetails = await this._eventRepository.findOne({ eventId: ticket.eventId });
        console.log('eventDetails', eventDetails);
        //   if (eventDetails?.ticketPurchased > eventDetails?.totalTicket) {
        //     throw new CustomError('Ticket full Sold out',HTTP_STATUS.FORBIDDEN)
        // } else if (eventDetails?.ticketPurchased + ticket.ticketCount > eventDetails?.totalTicket) {
        //     throw new CustomError('Not enough ticket available',HTTP_STATUS.FORBIDDEN)
        // }
        const paymentDetails = await this._paymentRepository.update({ paymentId: paymentIntentId }, { status: "success" });
        const newTicketPurchased = (eventDetails?.ticketPurchased || 0) + ticket.ticketCount;
        console.log('newTicketPurchased', newTicketPurchased);
        const updateTicketCount = await this._eventRepository.update({ eventId: ticket.eventId }, { ticketPurchased: newTicketPurchased });
        const updatedTicket = await this._ticketRepository.update({ ticketId: ticket.ticketId }, { paymentStatus: "successfull" });
        const adminId = process.env.ADMIN_ID;
        if (!adminId)
            throw new CustomError("Admin ID not found", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        const adminCommission = ticket.totalAmount * 0.1;
        const vendorPrice = ticket.totalAmount - adminCommission;
        const adminWalletId = await this._walletRepository.findOne({ userId: adminId });
        if (!adminWalletId) {
            throw new CustomError("Admin wallet not found", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        //  const adminWallet = await this._walletRepository.findOne({walletId:adminId})
        //  if(!adminWallet){throw new CustomError("Admin wallet not found",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
        const adminTransaction = {
            amount: adminCommission,
            currency: "INR",
            paymentStatus: "credit",
            paymentType: "adminCommission",
            walletId: adminWalletId?.walletId,
        };
        const transaction = await this._transactionRepository.save(adminTransaction);
        const adminWalletAddMoney = await this._walletRepository.updateWallet(adminId, adminCommission);
        const vendorWallet = await this._walletRepository.findOne({ userId: vendorId });
        let vendorWalletId;
        if (vendorWallet) {
            vendorWalletId = vendorWallet.walletId;
        }
        else {
            vendorWalletId = generateUniqueId("wallet");
            const newVendorWallet = {
                walletId: vendorWalletId,
                userId: vendorId,
                balance: 0,
                userModel: "vendors",
            };
            const vendorWallet = await this._walletRepository.save(newVendorWallet);
            if (!vendorWallet) {
                throw new CustomError("Vendor wallet not found", HTTP_STATUS.INTERNAL_SERVER_ERROR);
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
        const vendorTransaction = await this._transactionRepository.save(vendorTransactionDetails);
        const addMoneyToVendorWallet = await this._walletRepository.updateWallet(vendorId, vendorPrice);
        console.log('transaction', transaction);
        return updatedTicket;
    }
};
ConfirmTicketUseCase = __decorate([
    injectable(),
    __param(0, inject("IPaymentService")),
    __param(1, inject("IEventRepository")),
    __param(2, inject("ITicketRepository")),
    __param(3, inject("ITransactionRepository")),
    __param(4, inject("IPaymentRepository")),
    __param(5, inject("IWalletRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ConfirmTicketUseCase);
export { ConfirmTicketUseCase };
//# sourceMappingURL=confirm-ticket.usecase.js.map