import { inject, injectable } from "tsyringe";
import { IVerifyTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/varify-ticket-usecase.inteface";
import { TicketRepository } from "../../interfaceAdapters/repository/ticket/ticket-repository";
import { CustomError } from "../../domain/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";
import { ITicketEntity } from "../../domain/entities/ticket.entity";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";







@injectable()
export class VerifyTicketUseCase implements IVerifyTicketUseCase {

 
       constructor(
        @inject("ITicketRepository")
        private _ticketRepository: ITicketRepository,
        @inject("IEventRepository")
        private _eventRepository: IEventRepository
       ){}
  

    async execute(ticketId: string, eventId: string,status:string): Promise<ITicketEntity | null> {

          const ticket = await this._ticketRepository.findOne({ticketId})
          const event = await this._eventRepository.findOne({eventId})

           if(!event) throw new CustomError("Event not found",HTTP_STATUS.NOT_FOUND)
          if(!ticket) throw new CustomError("Ticket not found",HTTP_STATUS.NOT_FOUND)
          if(ticket.eventId !== eventId) throw new CustomError("Event not found",HTTP_STATUS.NOT_FOUND)
          if(ticket.checkedIn === "cancelled") throw new CustomError("Ticket already cancelled",HTTP_STATUS.FORBIDDEN)
          if(event.status === 'completed') throw new CustomError('Event is already completed',HTTP_STATUS.FORBIDDEN) 
          if(ticket.ticketStatus === "cancelled") throw new CustomError("Ticket already cancelled",HTTP_STATUS.FORBIDDEN)

          // if(ticket.ticketStatus === "used") throw new CustomError("Ticket already used",HTTP_STATUS.FORBIDDEN)
          
          if(status === 'checked_in'){
            ticket.ticketStatus = "used"
            ticket.checkedIn = "checked_in"
          }

          event.checkedInCount = event.checkedInCount ?? 0  // initialize if undefined
          event.checkedInCount!  += ticket.ticketCount
          
          const updatedTicket = await this._ticketRepository.update(
            {ticketId},
            ticket
          )

          const updatedEvent = await this._eventRepository.update(
            {eventId},
            event
          )

          return updatedTicket

}
      
}