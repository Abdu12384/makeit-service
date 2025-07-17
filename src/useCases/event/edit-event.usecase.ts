import { inject, injectable } from "tsyringe"
import { IEditEventUseCase } from "../../domain/interface/useCaseInterface/event/edit-event-usecase.interface"
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface"
import { IEventEntity } from "../../domain/entities/event.entity"
import { CustomError } from "../../domain/utils/custom.error"
import { ERROR_MESSAGES } from "../../shared/constants"
import { HTTP_STATUS } from "../../shared/constants"





@injectable()

export class EditEventUseCase implements IEditEventUseCase{
    constructor(
        @inject("IEventRepository") private _eventRepository: IEventRepository
    ){}

    async execute(eventId:string,data:Partial<IEventEntity>):Promise<void>{
        const event = await this._eventRepository.findOne({eventId})

        if(event?.status === "ongoing" && data.status === "upcoming"){throw new CustomError("Event is already ongoing",HTTP_STATUS.BAD_REQUEST)}
        if(event?.status === "ongoing" && data.status === "cancelled"){throw new CustomError("Cannot cancel an event that is already ongoing.",HTTP_STATUS.BAD_REQUEST)}
        if(event?.status === "upcoming" && data.status === "completed"){throw new CustomError( "Cannot change status from 'upcoming' to 'completed' directly. Please mark it as 'ongoing' first.",HTTP_STATUS.BAD_REQUEST)}
        if ((event?.status === "completed" || event?.status === "cancelled") && (data.status === "upcoming" || data.status === "ongoing" || data.status === "cancelled")) {
            throw new CustomError(
              "Cannot change status. Event is already completed or cancelled.",
              HTTP_STATUS.BAD_REQUEST
            );
          }

        if(!event){
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        console.log('event data',event)
        await this._eventRepository.update(
            {eventId: event.eventId},
            data
        )
    }
}

