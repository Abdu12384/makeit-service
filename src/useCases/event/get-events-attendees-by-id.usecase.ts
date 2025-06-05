import { inject, injectable } from "tsyringe";
import { IGetEventsAttendeesByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-attendees-by-id-usecase.interface.js";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface.js";















@injectable()
export class GetEventsAttendeesByIdUseCase implements IGetEventsAttendeesByIdUseCase{
    constructor(
        @inject("IEventRepository")
        private _eventRepository: IEventRepository
    ){}



    async execute(eventId:string):Promise<any>{
        
      const attendees = await this._eventRepository.findAttendeesById(eventId)
      
      console.log('attendees',attendees)
      
       return attendees || []
    }
}