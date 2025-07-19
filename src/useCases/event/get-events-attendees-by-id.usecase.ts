import { inject, injectable } from "tsyringe";
import { IGetEventsAttendeesByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-attendees-by-id-usecase.interface";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";
import { IClientEntity } from "../../domain/entities/client.entity";
import { ITicketEntity } from "../../domain/entities/ticket.entity";















@injectable()
export class GetEventsAttendeesByIdUseCase implements IGetEventsAttendeesByIdUseCase{
    constructor(
        @inject("ITicketRepository")
        private _ticketRepository: ITicketRepository
    ){}



    async execute(eventId:string,pageNumber:number,pageSize:number):Promise<{clients:IClientEntity[],total:number}>{
        
       const validPageNumber = Math.max(1,pageNumber||1)
       const validPageSize = Math.max(1,pageSize||10)
       const skip = (validPageNumber - 1) * validPageSize

      const {items, total} = await this._ticketRepository.findAllWithClientDetails(eventId,skip,validPageSize)
       
       const response = {
        clients:items,
        total:Math.ceil(total/validPageSize)
       }
      return response
    }
}