
import { IEventEntity } from "../../../entities/event.entity";

export interface IGetEventByIdUseCase{
  execute(eventId:string):Promise<IEventEntity>
}