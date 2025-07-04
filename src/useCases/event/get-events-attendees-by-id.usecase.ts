import { inject, injectable } from "tsyringe";
import { IGetEventsAttendeesByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-attendees-by-id-usecase.interface";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";















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
        console.log('userIddfdfd=--=-=-=-=-=---',userId)
        const userTicket = tickets.items.find((ticket: any) => ticket.clientId === userId)
        console.log('userTikc\\\\\\\\\=--=-=-=-=-=---',userTicket)
  
        return {
          ...attendee,
          ticket: userTicket || null
        }
      })
      
       return enrichedAttendees || []
    }
}