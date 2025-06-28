import { inject, injectable } from "tsyringe";
import { ICancelTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/cancel-ticket-usecase.interface";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { ITransactionsEntity } from "../../domain/entities/transaction.entity";
import { ITransactionRepository } from "../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface";
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface";
import { NotificationType } from "../../shared/dtos/notification";

@injectable()
export default class CancelTicketUseCase implements ICancelTicketUseCase {
    
    constructor(
        @inject("ITicketRepository")
        private _ticketRepository: ITicketRepository,
        @inject("ITransactionRepository")
        private _transactionRepository: ITransactionRepository,
        @inject("IWalletRepository")
        private _walletRepository: IWalletRepository,
        @inject("IEventRepository")
        private _eventRepository: IEventRepository,
        @inject("IPushNotificationService")
        private _pushNotificationService: IPushNotificationService
    ){}

    async execute(ticketId: string,cancelCount:number): Promise<void> {
      const ticket = await this._ticketRepository.findOneWithPopulate({ ticketId });
  
      if (!ticket) {
        throw new CustomError("Ticket not found", HTTP_STATUS.NOT_FOUND);
      }

      if(ticket.ticketStatus === "refunded"){
        throw new CustomError("Ticket already refunded", HTTP_STATUS.BAD_REQUEST);
      }

      const totalCount = ticket.ticketCount
      if(cancelCount > totalCount){
        throw new CustomError("Cancel count exceeds total ticket count", HTTP_STATUS.BAD_REQUEST);
      }

      const singleTicketAmount = ticket.totalAmount / totalCount
      const cancelAmount = singleTicketAmount * cancelCount
  
      
      // Platform keeps 10%
      const platformFee = cancelAmount * 0.1;
  
      // Vendor's share (to be deducted)
      const vendorShare = cancelAmount * 0.29;
  
      // Refundable to client
      const clientRefund = cancelAmount - platformFee - vendorShare;
  
      /** Step 1: Refund to client */
      const clientWallet = await this._walletRepository.updateWallet(ticket.clientId, clientRefund);
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
      
      ticket.totalAmount = ticket.totalAmount - cancelAmount;  

      ticket.ticketCount = totalCount - cancelCount;


      if(ticket.ticketCount === 0){
        ticket.ticketStatus = "refunded";
        ticket.checkedIn = "cancelled"
      }else{
        ticket.ticketStatus = "partially_refunded";
      }

      if (!ticket.cancellationHistory) {
        ticket.cancellationHistory = [];
      }      
  
      ticket.cancellationHistory.push({
        count: cancelCount,
        amount: cancelAmount,
        date: new Date()
      })

      const eventDetails = await this._eventRepository.findOne({eventId:ticket.eventId})
      if(!eventDetails){
        throw new CustomError("Event not found", HTTP_STATUS.NOT_FOUND);
      }

      eventDetails.ticketPurchased = Math.max(0, eventDetails.ticketPurchased! - cancelCount); 
      eventDetails.attendeesCount = Math.max(0, eventDetails.attendeesCount - cancelCount); 

      eventDetails.checkedInCount = Math.max(0, eventDetails.checkedInCount! - cancelCount) || 0; 

      await this._eventRepository.update({ eventId: ticket.eventId }, eventDetails);

      await this._pushNotificationService.sendNotification(
        ticket.clientId,
        "Ticket Cancelled",
        `Your booking for ${eventDetails?.title || "an event"} has been cancelled.`,
        NotificationType.TICKET_BOOKING,
        "client"
      );

      await this._pushNotificationService.sendNotification(
        vendorId,
        "A ticket has been cancelled for your event",
        `${ticket.ticketCount} tickets were cancelled for ${eventDetails?.title}.`,
        NotificationType.TICKET_BOOKING,
        "vendor"
      );

      /** Step 3: Update ticket status */
      await this._ticketRepository.update({ ticketId }, ticket);
    }
}