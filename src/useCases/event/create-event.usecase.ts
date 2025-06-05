import { inject, injectable } from "tsyringe";
import { ICreateEventUseCase } from "../../domain/interface/useCaseInterface/event/create-event-usecase.interface.js";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";





@injectable()
export class CreateEventUseCase implements ICreateEventUseCase{
    constructor(
        @inject("IEventRepository") private _eventRepository: IEventRepository
    ){}

    async execute(data:any,userId:string):Promise<any>{
        
        const eventId = generateUniqueId("event")
        const event = await this._eventRepository.save(
          {
            eventId,
            ...data,
            hostedBy:userId
          }
        )
        return event
    }
}