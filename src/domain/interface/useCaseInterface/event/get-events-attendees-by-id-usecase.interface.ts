import { IClientEntity } from "../../../entities/client.entity";

export interface IGetEventsAttendeesByIdUseCase{
  execute(eventId:string):Promise<IClientEntity[]>
}
  