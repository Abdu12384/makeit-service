import { inject, injectable } from "tsyringe";
import { IGetEventsAttendeesByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-attendees-by-id-usecase.interface";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";
import { IClientEntity } from "../../domain/entities/client.entity";
import { ITicketEntity } from "../../domain/entities/ticket.entity";















@injectable()
export class GetEventsAttendeesByIdUseCase implements IGetEventsAttendeesByIdUseCase{
    constructor(
        @inject("IEventRepository")
        private _eventRepository: IEventRepository,
        @inject("ITicketRepository")
        private _ticketRepository: ITicketRepository
    ){}



    async execute(eventId:string):Promise<IClientEntity[]>{
        
      const tickets = await this._ticketRepository.findAllWithClientDetails(eventId)
      // if (!attendees || attendees.length === 0) return []

      

      // const enrichedAttendees = attendees.map((attendee: IClientEntity) => {
      //   const userId = typeof attendee === 'string' ? attendee : attendee.userId
      //   // const userTicket = tickets.items.find((ticket: ITicketEntity) => ticket.clientId === userId)

      //   // const userTickets = tickets.items.filter(
      //   //   (ticket: ITicketEntity) =>
      //   //     ticket.clientId === userId && ticket.eventId === eventId
      //   // );
    

      //   return {
      //     ...attendee,
      //     // ticket: userTickets|| null
      //   }
      // })
      
       return tickets || []
    }
}