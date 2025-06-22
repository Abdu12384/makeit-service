import { inject, injectable } from "tsyringe";
import { IGetEventsAttendeesByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-attendees-by-id-usecase.interface.js";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface.js";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface.js";















@injectable()
export class GetEventsAttendeesByIdUseCase implements IGetEventsAttendeesByIdUseCase{
    constructor(
        @inject("IEventRepository")
        private _eventRepository: IEventRepository,
        @inject("ITicketRepository")
        private _ticketRepository: ITicketRepository
    ){}



    async execute(eventId:string):Promise<any>{
        
      const attendees = await this._eventRepository.findAttendeesById(eventId)
      const tickets = await this._ticketRepository.findAll({eventId})

      if (!attendees || attendees.length === 0) return []

      const enrichedAttendees = attendees.map((attendee: any) => {
        const userId = typeof attendee === 'string' ? attendee : attendee.userId
        const userTicket = tickets.items.find((ticket: any) => ticket.clientId === userId)
  
        return {
          ...attendee,
          ticket: userTicket || null
        }
      })
      
       return enrichedAttendees || []
    }
}