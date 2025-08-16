import { inject, injectable } from "tsyringe";
import { IGetAllEventsUseCase } from "../../domain/interface/useCaseInterface/event/get-all-events-usecase.interface";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { IEventEntity } from "../../domain/entities/event.entity";











@injectable()
export class GetAllEventsUseCase implements IGetAllEventsUseCase{
    constructor(
      @inject("IEventRepository")
      private _eventRepository: IEventRepository
    ){}

    async execute(pageNumber: number, pageSize: number, searchTermString: string,lat:number,lng:number): Promise<{events:IEventEntity[],total:number}> {

        const validPageNumber = Math.max(1, pageNumber || 1)
        const validPageSize = Math.max(1, pageSize || 10)
        const skip = (validPageNumber - 1) * validPageSize


        const filter: Record<string,unknown> = {
          status: "upcoming",
          isActive: true
        }
        if(searchTermString){
          filter.title = { $regex: searchTermString, $options: "i" }
        }

        let items: IEventEntity[] = [];
        let total = 0;
        if(lat && lng){

          const locationEvents = await this._eventRepository.findAllByLocation({
            lat,
            lng,
            radius:10
          });
          const filtered = searchTermString
          ? locationEvents.filter(ev =>
              ev.title.toLowerCase().includes(searchTermString.toLowerCase())
            )
          : locationEvents;
  
        total = filtered.length;
        items = filtered.slice(skip, skip + validPageSize);
        }
        else{
        const result = await this._eventRepository.findAll(
          filter,
          skip,
          validPageSize,
          {createdAt: -1}
        )
        items = result.items;
        total = result.total;
        }
        const response = {
          events: items,
          total: Math.ceil(total / validPageSize)
        }
        return response
    }
  
}
