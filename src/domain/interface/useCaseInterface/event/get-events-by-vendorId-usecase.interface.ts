import { IEventEntity } from "../../../entities/event.entity";

export interface IGetEventsByVendorIdUseCase {
    execute(userId:string,pageNumber:number,pageSize:number):Promise<{events:IEventEntity[],total:number}>
}