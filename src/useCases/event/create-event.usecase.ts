import { inject, injectable } from "tsyringe";
import { ICreateEventUseCase } from "../../domain/interface/useCaseInterface/event/create-event-usecase.interface";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { IEventEntity } from "../../domain/entities/event.entity";
import { CustomError } from "../../domain/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";





@injectable()
export class CreateEventUseCase implements ICreateEventUseCase{
    constructor(
        @inject("IEventRepository") private _eventRepository: IEventRepository
    ){}

    async execute(data:IEventEntity,userId:string):Promise<IEventEntity>{

        if(data.status !== "upcoming"){
          throw new CustomError(
            "Initial status must be 'upcoming'",
            HTTP_STATUS.BAD_REQUEST
          )
        }
        
        const eventId = generateUniqueId()
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