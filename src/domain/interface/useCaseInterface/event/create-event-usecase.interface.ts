import { IEventEntity } from "../../../entities/event.entity";

export interface ICreateEventUseCase{
    execute(data:IEventEntity,userId:string):Promise<IEventEntity>
}