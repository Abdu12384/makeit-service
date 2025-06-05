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
let CancelTicketUseCase = class CancelTicketUseCase {
    _ticketRepository;
    _transactionRepository;
    _walletRepository;
    constructor(_ticketRepository, _transactionRepository, _walletRepository) {
        this._ticketRepository = _ticketRepository;
        this._transactionRepository = _transactionRepository;
        this._walletRepository = _walletRepository;
    }
    async execute(ticketId) {
        const ticket = await this._ticketRepository.findOneWithPopulate({ ticketId });
        console.log('ticket', ticket);
        if (!ticket) {
            throw new CustomError("Ticket not found", HTTP_STATUS.NOT_FOUND);
        }
        const totalAmount = ticket.totalAmount;
        // Platform keeps 10%
        const platformFee = totalAmount * 0.1;
        // Vendor's share (to be deducted)
        const vendorShare = totalAmount * 0.29;
        // Refundable to client
        const clientRefund = totalAmount - platformFee - vendorShare;
        console.log('clientRefund', clientRefund);
        /** Step 1: Refund to client */
        const clientWallet = await this._walletRepository.updateWallet(ticket.clientId, clientRefund);
        console.log('clientWallet', clientWallet);
        if (!clientWallet) {
            throw new CustomError("Failed to update client wallet", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        const clientTransaction = {
            amount: clientRefund,
            currency: "INR",
            paymentStatus: "credit",
            paymentType: "refund",
            walletId: clientWallet.walletId,
        };
        const savedClientTx = await this._transactionRepository.save(clientTransaction);
        if (!savedClientTx) {
            throw new CustomError("Failed to log client transaction", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        /** Step 2: Deduct from vendor */
        const vendorId = ticket.vendorId;
        console.log('vendorId', vendorId);
        const vendorWallet = await this._walletRepository.reduceMoney(vendorId, vendorShare);
        if (!vendorWallet) {
            throw new CustomError("Failed to deduct vendor wallet", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        const vendorTransaction = {
            amount: vendorShare,
            currency: "INR",
            paymentStatus: "debit",
            paymentType: "refund",
            walletId: vendorWallet.walletId,
        };
        const savedVendorTx = await this._transactionRepository.save(vendorTransaction);
        if (!savedVendorTx) {
            throw new CustomError("Failed to log vendor transaction", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        /** Step 3: Update ticket status */
        ticket.ticketStatus = "refunded";
        await this._ticketRepository.update({ ticketId }, ticket);
    }
};
CancelTicketUseCase = __decorate([
    injectable(),
    __param(0, inject("ITicketRepository")),
    __param(1, inject("ITransactionRepository")),
    __param(2, inject("IWalletRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], CancelTicketUseCase);
export default CancelTicketUseCase;
//# sourceMappingURL=cancel-ticket.usecase.js.map