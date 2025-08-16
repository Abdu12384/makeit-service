import { inject, injectable } from "tsyringe";
import { ICheckEventBookingAvliblityUseCase } from "../../domain/interface/useCaseInterface/event/check-event-booking-avliblity-usecase.interface";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";







@injectable()
export class CheckEventBookingAvliblityUseCase implements ICheckEventBookingAvliblityUseCase{
    constructor(
        @inject("IEventRepository")
        private _eventRepository: IEventRepository,
        @inject("ITicketRepository")
        private _ticketRepository: ITicketRepository,
    ){}
    
    async execute(eventId:string,userId:string,ticketCount:number):Promise<void>{
        
      console.log('event id here',eventId)
      const event = await this._eventRepository.findOne({eventId})
      console.log('event',event)
      if (!event) throw new CustomError(ERROR_MESSAGES.REQUEST_NOT_FOUND,HTTP_STATUS.NOT_FOUND)

      const ticket = await this._ticketRepository.findOne({eventId,clientId:userId})
      console.log('ticket',ticket)
      //  if(!ticket){ 
      //   throw new CustomError(ERROR_MESSAGES.REQUEST_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
      // }

      if (ticket && (ticket.ticketCount + ticketCount > event.maxTicketsPerUser)) {
        throw new CustomError(
          `You have already reached your ticket limit. You can only book ${event.maxTicketsPerUser - ticket.ticketCount} more ticket(s).`,
          HTTP_STATUS.BAD_REQUEST
        );
      }

        if(event.totalTicket === event.ticketPurchased){
          throw new CustomError("Event is already full",HTTP_STATUS.BAD_REQUEST)
        }

    }
}
