import { inject, injectable } from "tsyringe";
import { IConfirmTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/confirm-ticket-usecase.interface";
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";
import { ITransactionRepository } from "../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface";
import { ITransactionsEntity } from "../../domain/entities/transaction.entity";
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository";
import { ITicketEntity } from "../../domain/entities/ticket.entity";
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface";
import { NotificationType } from "../../shared/dtos/notification";
import { IRedisTokenRepository } from "../../domain/interface/repositoryInterfaces/redis/redis-token-repository.interface";
import { config } from "../../shared/config";










@injectable()

export class ConfirmTicketUseCase implements IConfirmTicketUseCase{
    constructor(
        @inject("IPaymentService")
        private _stripeService: IPaymentService,
        @inject("IEventRepository")
        private _eventRepository: IEventRepository,
        @inject("ITicketRepository")
        private _ticketRepository: ITicketRepository,
        @inject("ITransactionRepository")
        private _transactionRepository: ITransactionRepository,
        @inject("IPaymentRepository")
        private _paymentRepository: IPaymentRepository,
        @inject("IWalletRepository")
        private _walletRepository: IWalletRepository,
        @inject("IPushNotificationService")
        private _pushNotificationService: IPushNotificationService,
        @inject("IRedisTokenRepository")
        private _redisTokenRepository: IRedisTokenRepository
    ){}

    async execute(ticket:ITicketEntity, paymentIntentId: string, vendorId: string): Promise<ITicketEntity | null> {
        const confirmPayment = await this._stripeService.confirmPayment(paymentIntentId)
        if(!confirmPayment){throw new CustomError("Error while confirming payment",HTTP_STATUS.INTERNAL_SERVER_ERROR)}

        const eventDetails = await this._eventRepository.findOne({eventId:ticket.eventId})
       
      const paymentDetails = await this._paymentRepository.update({paymentId:paymentIntentId},{status:"success"})
      
      const newTicketPurchased = (eventDetails?.ticketPurchased || 0) + ticket.ticketCount
      const updateTicketCount = await this._eventRepository.update({eventId:ticket.eventId},{ticketPurchased:newTicketPurchased})
      const updatedTicket = await this._ticketRepository.update({ticketId:ticket.ticketId},{paymentStatus:"successfull"})
      const adminId = config.adminId

      if(!adminId) throw new CustomError("Admin ID not found",HTTP_STATUS.INTERNAL_SERVER_ERROR)
       const adminCommission = ticket.totalAmount * 0.1
       const vendorPrice = ticket.totalAmount - adminCommission

         const adminWalletId = await this._walletRepository.findOne({userId:adminId})
         if(!adminWalletId){throw new CustomError("Admin wallet not found",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
      
       const adminTransaction : ITransactionsEntity = {
         amount: adminCommission,
         currency: "INR",
         paymentStatus: "credit",
         paymentType: "adminCommission",
         walletId:adminWalletId?.walletId,
         relatedTitle:  `Admin Commission from Ticket Booking: ${eventDetails?.title || "a transaction"}`
       }

       const transaction = await this._transactionRepository.save(adminTransaction)
       const adminWalletAddMoney = await this._walletRepository.updateWallet(adminId,adminCommission)
       const vendorWallet = await this._walletRepository.findOne({userId:vendorId})

       let vendorWalletId: string 
        
       if(vendorWallet){
        vendorWalletId = vendorWallet.walletId
       }else{
        vendorWalletId = generateUniqueId("wallet")
        const newVendorWallet = {
          walletId: vendorWalletId,
          userId: vendorId,
          balance: 0,
          userModel: "vendors",
        }
        const vendorWallet = await this._walletRepository.save(newVendorWallet)
        if(!vendorWallet){throw new CustomError("Vendor wallet not found",HTTP_STATUS.INTERNAL_SERVER_ERROR)}

         vendorWalletId = vendorWallet.walletId
       }

       const vendorTransactionDetails : ITransactionsEntity = {
         amount: vendorPrice,
         currency: "INR",
         paymentStatus: "credit",
         paymentType:"ticketBooking",
         walletId: vendorWalletId,
         relatedTitle: `Ticket: ${eventDetails?.title || "an event"}`
       }
       const vendorTransaction = await this._transactionRepository.save(vendorTransactionDetails)
       const addMoneyToVendorWallet = await this._walletRepository.updateWallet(vendorId,vendorPrice)
       

       await this._pushNotificationService.sendNotification(
        ticket.clientId,
        "Ticket Booking Confirmed",
        `Your booking for ${eventDetails?.title || "an event"} has been confirmed.`,
        NotificationType.TICKET_BOOKING,
        "client"
      );

      await this._pushNotificationService.sendNotification(
        vendorId,
        "A ticket has been booked for your event",
        `${ticket.ticketCount} tickets were booked for ${eventDetails?.title}.`,
        NotificationType.TICKET_BOOKING,
        "vendor"
      );
      
      await this._redisTokenRepository.deleteEventLock(ticket.clientId, ticket.eventId);
      
      return  updatedTicket
    }
}