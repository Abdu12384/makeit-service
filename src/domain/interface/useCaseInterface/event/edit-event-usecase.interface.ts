import { IEventEntity } from "../../../entities/event.entity";

export interface IEditEventUseCase{
  execute(eventId:string,data:Partial<IEventEntity>):Promise<void>
}