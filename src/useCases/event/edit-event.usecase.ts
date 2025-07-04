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
        if(!event){
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        await this._eventRepository.update(
            {eventId: event.eventId},
            data
        )
    }
}

