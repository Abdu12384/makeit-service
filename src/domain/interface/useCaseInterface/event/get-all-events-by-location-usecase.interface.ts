import { IEventEntity } from "../../../entities/event.entity";

export interface IGetAllEventsByLocationUseCase{
    execute(lat:number,lng:number,radius:number):Promise<IEventEntity[]>
}