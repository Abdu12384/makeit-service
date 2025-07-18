import { IClientEntity } from "../../../entities/client.entity";

export interface IGetEventsAttendeesByIdUseCase{
  execute(eventId:string,pageNumber:number,pageSize:number):Promise<{clients:IClientEntity[],total:number}>
}
  