import { inject, injectable } from "tsyringe";
import { IVerifyTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/varify-ticket-usecase.inteface.js";
import { TicketRepository } from "../../interfaceAdapters/repository/ticket/ticket-repository.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface.js";









@injectable()
export class VerifyTicketUseCase implements IVerifyTicketUseCase {

 
       constructor(
        @inject("ITicketRepository")
        private _ticketRepository: ITicketRepository
       ){}
  

    async execute(ticketId: string, eventId: string): Promise<any> {

          const ticket = await this._ticketRepository.findOne({ticketId})
           console.log('ticket',ticket)

          if(!ticket) throw new CustomError("Ticket not found",HTTP_STATUS.NOT_FOUND)
          console.log('ticket.eventId',ticket.eventId)
          if(ticket.eventId !== eventId) throw new CustomError("Event not found",HTTP_STATUS.NOT_FOUND)

          if(ticket.ticketStatus === "used") throw new CustomError("Ticket already used",HTTP_STATUS.FORBIDDEN)

          ticket.ticketStatus = "used"
          const updatedTicket = await this._ticketRepository.update(
            {ticketId},
            ticket
          )

          return updatedTicket

}
      
}