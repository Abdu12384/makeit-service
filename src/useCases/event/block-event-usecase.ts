import { CustomError } from "../../domain/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { inject, injectable } from "tsyringe";
import { IBlockEventUseCase } from "../../domain/interface/useCaseInterface/event/block-event-usecase.interface";






@injectable()
export class BlockEventUseCase implements IBlockEventUseCase{
    constructor(
      @inject("IEventRepository")
      private _eventRepository: IEventRepository
    ){}

    async blockEvent(eventId: string): Promise<void> {
      const event = await this._eventRepository.findOne({eventId})
      if(!event){
        throw new CustomError(
          "Event not found",
          HTTP_STATUS.NOT_FOUND
        )
      }
      const isActive = event.isActive ? false : true
      await this._eventRepository.update(
        {eventId},
        {isActive}
        )      
      
    }
  }