import { inject, injectable } from "tsyringe";
import { IGetAllEventsUseCase } from "../../domain/interface/useCaseInterface/event/get-all-events-usecase.interface";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";











@injectable()
export class GetAllEventsUseCase implements IGetAllEventsUseCase{
    constructor(
      @inject("IEventRepository")
      private _eventRepository: IEventRepository
    ){}

    async execute(pageNumber: number, pageSize: number, searchTermString: string): Promise<any> {


        const validPageNumber = Math.max(1, pageNumber || 1)
        const validPageSize = Math.max(1, pageSize || 10)
        const skip = (validPageNumber - 1) * validPageSize


        let filter: any = {}
        if(searchTermString){
          filter.$or = [
            {name: {$regex: searchTermString, $options: "i"}},
            {description: {$regex: searchTermString, $options: "i"}}
          ]
        }
        const {items , total} = await this._eventRepository.findAll(
          filter,
          skip,
          validPageSize,
          {createdAt: -1}
        )

        const response = {
          events: items,
          total: Math.ceil(total / validPageSize)
        }
        return response
    }
  
}
