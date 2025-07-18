import { inject, injectable } from "tsyringe"
import { IEditEventUseCase } from "../../domain/interface/useCaseInterface/event/edit-event-usecase.interface"
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface"
import { IEventEntity } from "../../domain/entities/event.entity"
import { CustomError } from "../../domain/utils/custom.error"
import { ERROR_MESSAGES } from "../../shared/constants"
import { HTTP_STATUS } from "../../shared/constants"
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface"
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface"
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface"
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface"
import { ITransactionRepository } from "../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface"
import { ITransactionsEntity } from "../../domain/entities/transaction.entity"





@injectable()

export class EditEventUseCase implements IEditEventUseCase{
    constructor(
        @inject("IEventRepository") private _eventRepository: IEventRepository,
        @inject("ITicketRepository") private _ticketRepository: ITicketRepository,
        @inject("IWalletRepository") private _walletRepository: IWalletRepository,
        @inject("ITransactionRepository") private _transactionRepository: ITransactionRepository
    ){}

    async execute(eventId:string,data:Partial<IEventEntity>):Promise<void>{
        const event = await this._eventRepository.findOne({eventId})

        if(!event){
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }


        if(event?.status === "ongoing" && data.status === "upcoming"){throw new CustomError("Event is already ongoing",HTTP_STATUS.BAD_REQUEST)}
        if(event?.status === "ongoing" && data.status === "cancelled"){throw new CustomError("Cannot cancel an event that is already ongoing.",HTTP_STATUS.BAD_REQUEST)}
        if(event?.status === "upcoming" && data.status === "completed"){throw new CustomError( "Cannot change status from 'upcoming' to 'completed' directly. Please mark it as 'ongoing' first.",HTTP_STATUS.BAD_REQUEST)}
        if ((event?.status === "completed" || event?.status === "cancelled") && (data.status === "upcoming" || data.status === "ongoing" || data.status === "cancelled")) {
            throw new CustomError(
              "Cannot change status. Event is already completed or cancelled.",
              HTTP_STATUS.BAD_REQUEST
            );
          }
          if (event.status !== "cancelled" && data.status === "cancelled") {
            const tickets = await this._ticketRepository.find({
              eventId,
              ticketStatus: { $ne: "cancelled" }
            });
      
            for (const ticket of tickets) {
              const totalAmount = ticket.totalAmount * ticket.ticketCount;
      
            const clientWallet = await this._walletRepository.findOne({userId:ticket.clientId})
            const vendorWallet = await this._walletRepository.findOne({userId:ticket.vendorId})
              await this._walletRepository.findOne({userId:ticket.vendorId})

              await this._walletRepository.updateWallet(ticket.clientId, totalAmount);
              await this._walletRepository.reduceMoney(ticket.vendorId, -totalAmount);


              const clientTransaction : ITransactionsEntity = {
                amount: totalAmount,
                currency: "INR",
                paymentStatus: "credit", 
                paymentType:"ticketBooking",
                walletId: clientWallet?.walletId!,
                relatedTitle: `Event Cancelled Refund from: ${event?.title || "an event"}`
              }

              const vendorTransaction : ITransactionsEntity = {
                amount: totalAmount,
                currency: "INR",
                paymentStatus: "debit", 
                paymentType:"ticketBooking",
                walletId: vendorWallet?.walletId!,
                relatedTitle: `Event Cancelled Refund from: ${event?.title || "an event"}`
              }

              await this._transactionRepository.save(clientTransaction)
              await this._transactionRepository.save(vendorTransaction)
      
              await this._ticketRepository.update(
                { ticketId: ticket.ticketId },
                { ticketStatus: "cancelled" },
              );
            }
          }


        await this._eventRepository.update(
            {eventId: event.eventId},
            data
        )
    }
}

