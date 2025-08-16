import { inject, injectable } from "tsyringe";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { IGetAllEventsByLocationUseCase } from "../../domain/interface/useCaseInterface/event/get-all-events-by-location-usecase.interface";
import { IEventEntity } from "../../domain/entities/event.entity";









@injectable()
export class GetAllEventsByLocationUseCase implements IGetAllEventsByLocationUseCase{
    constructor(
        @inject("IEventRepository")
        private _eventRepository: IEventRepository
    ){}

    async execute(lat:number,lng:number,radius:number): Promise<IEventEntity[]> {
        const events = await this._eventRepository.findAllByLocation({
            lat,
            lng,
            radius
        })
        return events
    }
}