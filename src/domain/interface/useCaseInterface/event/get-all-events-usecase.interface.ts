import { IEventEntity } from "../../../entities/event.entity";

export interface IGetAllEventsUseCase{
  execute(
    pageNumber: number,
    pageSize: number,
    searchTermString: string,
    lat:number,
    lng:number,
  ): Promise<{events:IEventEntity[],total:number}>
}