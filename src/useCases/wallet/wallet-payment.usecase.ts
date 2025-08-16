import { ITicketEntity } from "../../domain/entities/ticket.entity";
import { IWalletPaymentUseCase } from "../../domain/interface/useCaseInterface/wallet/wallet-payment-usecase.interface";
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface";
import { inject, injectable } from "tsyringe";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { IQRService } from "../../domain/interface/servicesInterface/qr-service.interface";
import { ITransactionRepository } from "../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface";
import { ITransactionsEntity } from "../../domain/entities/transaction.entity";
import { TicketDto } from "../../shared/dtos/request/ticket-requst.dto";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";

  
  
  
  
@injectable()
export class WalletPaymentUseCase implements IWalletPaymentUseCase{
  
     constructor(
        @inject("IWalletRepository")
        private _walletRepository: IWalletRepository,
        @inject("IEventRepository")
        private _eventRepository: IEventRepository,
        @inject("IQRService") private _qrService: IQRService,
        @inject("ITicketRepository") private _ticketRepository: ITicketRepository,
       @inject("ITransactionRepository")
        private _transactionRepository: ITransactionRepository
        
     ){}

    async execute(
        ticket:TicketDto,
        amount:number,
        eventId:string,
        type:string,
        totalTicketCount:number,
        vendorId:string,
        clientId:string,
        paymentMethod:string):Promise<ITicketEntity>{
    

        const eventDetails = await this._eventRepository.findOne({eventId})
        if(!eventDetails){throw new CustomError("Event not found",HTTP_STATUS.NOT_FOUND)}

        
       
    if(eventDetails.status === "cancelled") throw new CustomError("Event cancelled",HTTP_STATUS.FORBIDDEN) 
        if(eventDetails.status === "completed") throw new CustomError("Event already completed",HTTP_STATUS.FORBIDDEN) 
        if(eventDetails?.ticketPurchased && eventDetails?.ticketPurchased === eventDetails.totalTicket) throw new CustomError("Ticket Sold Out",HTTP_STATUS.FORBIDDEN)
        if(eventDetails?.ticketPurchased && eventDetails?.ticketPurchased + totalTicketCount > eventDetails.totalTicket) throw new CustomError(`Only ${eventDetails.totalTicket - eventDetails.ticketPurchased} tickets are available. Please reduce the quantity.`,HTTP_STATUS.FORBIDDEN)


            const wallet = await this._walletRepository.findOne({userId: clientId });
            if (!wallet) {
              throw new CustomError("Wallet not found", HTTP_STATUS.NOT_FOUND);
            }

             if (wallet.balance < amount) {
                throw new CustomError("Insufficient wallet balance", HTTP_STATUS.BAD_REQUEST);
              }

              wallet.balance -= amount;
              await this._walletRepository.reduceMoney(clientId, amount);


              const clientTransactionDetails : ITransactionsEntity = {
                       amount: amount,
                       currency: "INR",
                       paymentStatus: "debit",
                       paymentType:"ticketBooking",
                       walletId: wallet.walletId,
                       relatedTitle: `Ticket: ${eventDetails?.title || "an event"}`
                     }


            await this._transactionRepository.save(clientTransactionDetails)


            const vendorWallet = await this._walletRepository.findOne({ userId: vendorId });
            if (!vendorWallet) {
              throw new CustomError("Vendor wallet not found", HTTP_STATUS.NOT_FOUND);
            }

            vendorWallet.balance += amount;
            await this._walletRepository.updateWallet(vendorId, amount);

            const vendorTransactionDetails : ITransactionsEntity = {
                     amount: amount,
                     currency: "INR",
                     paymentStatus: "credit",
                     paymentType:"ticketBooking",
                     walletId: vendorWallet.walletId,
                     relatedTitle: `Ticket: ${eventDetails?.title || "an event"}`
                   }

            await this._transactionRepository.save(vendorTransactionDetails)

            const HOSTNAME = process.env.HOSTNAME
            const ticketId = generateUniqueId()
            const qrLink = `${HOSTNAME}/verify-ticket/${ticketId}/${eventDetails.eventId}`
            const qrCode = await this._qrService.generateQRCode(qrLink)
            if(!qrCode){throw new CustomError("QR Code generation failed",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
         
            
            let attendeesCount = eventDetails?.ticketPurchased || 0
            attendeesCount += totalTicketCount

            const currentAttendees = eventDetails.attendees || []
            if (!currentAttendees.includes(clientId)) {
              currentAttendees.push(clientId)
            }

            const eventUpdate = {
              attendeesCount,
              attendees:currentAttendees
            }

            await this._eventRepository.update(
              {eventId:eventDetails.eventId},
              eventUpdate
            )


      const ogTicket = {
        email:ticket.email,
        phone:ticket.phone,
        eventId:ticket.eventId,
        ticketId: ticketId,
        qrCodeLink: qrCode,
        clientId: clientId,
        paymentStatus: "successfull" as const,
        ticketStatus: "unused" as const,
        ticketCount: totalTicketCount,
        totalAmount: amount,
        // paymentTransactionId: paymentDocument.paymentId,
        vendorId: vendorId,
    }
    const createdTicket = await this._ticketRepository.save(ogTicket)
    if(!createdTicket){throw new CustomError("Error while saving ticket details",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
    return createdTicket

    }
}
