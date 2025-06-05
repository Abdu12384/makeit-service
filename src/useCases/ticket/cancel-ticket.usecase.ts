import { inject, injectable } from "tsyringe";
import { ICancelTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/cancel-ticket-usecase.interface.js";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { ITransactionsEntity } from "../../domain/entities/transaction.entity.js";
import { ITransactionRepository } from "../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface.js";
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface.js";














@injectable()
export default class CancelTicketUseCase implements ICancelTicketUseCase {
    
    constructor(
        @inject("ITicketRepository")
        private _ticketRepository: ITicketRepository,
        @inject("ITransactionRepository")
        private _transactionRepository: ITransactionRepository,
        @inject("IWalletRepository")
        private _walletRepository: IWalletRepository,
    ){}

    async execute(ticketId: string): Promise<void> {
      const ticket = await this._ticketRepository.findOneWithPopulate({ ticketId });
      console.log('ticket',ticket)
  
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
      console.log('clientRefund',clientRefund)
  
      /** Step 1: Refund to client */
      const clientWallet = await this._walletRepository.updateWallet(ticket.clientId, clientRefund);
      console.log('clientWallet',clientWallet)
      if (!clientWallet) {
        throw new CustomError("Failed to update client wallet", HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }
  
      const clientTransaction: ITransactionsEntity = {
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
      console.log('vendorId',vendorId)
      const vendorWallet = await this._walletRepository.reduceMoney(vendorId, vendorShare);
      if (!vendorWallet) {
        throw new CustomError("Failed to deduct vendor wallet", HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }
  
      const vendorTransaction: ITransactionsEntity = {
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
}
