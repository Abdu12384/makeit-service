import { inject, injectable } from "tsyringe";
import { IConfirmTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/confirm-ticket-usecase.interface.js";
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface.js";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface.js";
import { ITransactionRepository } from "../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface.js";
import { ITransactionsEntity } from "../../domain/entities/transaction.entity.js";
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository.js";
import { ITicketEntity } from "../../domain/entities/ticket.entity.js";
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface.js";
import { NotificationType } from "../../shared/dtos/notification.js";










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
        private _pushNotificationService: IPushNotificationService
    ){}

    async execute(ticket:ITicketEntity, paymentIntentId: string, vendorId: string): Promise<any> {
        const confirmPayment = await this._stripeService.confirmPayment(paymentIntentId)
        if(!confirmPayment){throw new CustomError("Error while confirming payment",HTTP_STATUS.INTERNAL_SERVER_ERROR)}

        const eventDetails = await this._eventRepository.findOne({eventId:ticket.eventId})
        console.log('eventDetails',eventDetails)
      //   if (eventDetails?.ticketPurchased > eventDetails?.totalTicket) {
      //     throw new CustomError('Ticket full Sold out',HTTP_STATUS.FORBIDDEN)
      // } else if (eventDetails?.ticketPurchased + ticket.ticketCount > eventDetails?.totalTicket) {
      //     throw new CustomError('Not enough ticket available',HTTP_STATUS.FORBIDDEN)
      // }
       
      const paymentDetails = await this._paymentRepository.update({paymentId:paymentIntentId},{status:"success"})
      
      const newTicketPurchased = (eventDetails?.ticketPurchased || 0) + ticket.ticketCount
      console.log('newTicketPurchased',newTicketPurchased)
      const updateTicketCount = await this._eventRepository.update({eventId:ticket.eventId},{ticketPurchased:newTicketPurchased})
      const updatedTicket = await this._ticketRepository.update({ticketId:ticket.ticketId},{paymentStatus:"successfull"})
      const adminId = process.env.ADMIN_ID

      if(!adminId) throw new CustomError("Admin ID not found",HTTP_STATUS.INTERNAL_SERVER_ERROR)
       const adminCommission = ticket.totalAmount * 0.1
       const vendorPrice = ticket.totalAmount - adminCommission

         const adminWalletId = await this._walletRepository.findOne({userId:adminId})
         if(!adminWalletId){throw new CustomError("Admin wallet not found",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
      //  const adminWallet = await this._walletRepository.findOne({walletId:adminId})
      //  if(!adminWallet){throw new CustomError("Admin wallet not found",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
      
       const adminTransaction : ITransactionsEntity = {
         amount: adminCommission,
         currency: "INR",
         paymentStatus: "credit",
         paymentType: "adminCommission",
         walletId:adminWalletId?.walletId,
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
       }
       const vendorTransaction = await this._transactionRepository.save(vendorTransactionDetails)
       const addMoneyToVendorWallet = await this._walletRepository.updateWallet(vendorId,vendorPrice)
       
       console.log('transaction',transaction)

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
      

      return  updatedTicket
    }
}