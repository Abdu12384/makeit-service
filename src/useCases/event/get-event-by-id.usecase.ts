import { inject, injectable } from "tsyringe"
import { IGetEventByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-event-by-id-usecase.interface"
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface"
import { CustomError } from "../../domain/utils/custom.error"
import { ERROR_MESSAGES } from "../../shared/constants"
import { HTTP_STATUS } from "../../shared/constants"
import { IEventEntity } from "../../domain/entities/event.entity"
import { IVendorEntity } from "../../domain/entities/vendor.entity"







@injectable()
export class GetEventByIdUseCase implements IGetEventByIdUseCase{
    constructor(
      @inject("IEventRepository")
      private _eventRepository: IEventRepository
    ){}

    async execute(eventId: string): Promise<IEventEntity| IVendorEntity> {
        const event = await this._eventRepository.findWithAggregation(eventId)
        if(!event){
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        return event
    } 
}


