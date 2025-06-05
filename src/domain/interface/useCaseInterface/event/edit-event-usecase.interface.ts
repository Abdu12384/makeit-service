import { IEventEntity } from "../../../entities/event.entity.js";

export interface IEditEventUseCase{
  execute(eventId:string,data:Partial<IEventEntity>):Promise<void>
}