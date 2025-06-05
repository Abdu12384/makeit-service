
import { IEventEntity } from "../../../entities/event.entity.js";

export interface IGetEventByIdUseCase{
  execute(eventId:string):Promise<IEventEntity>
}