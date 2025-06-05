import { IBaseRepository } from "../base-repository.interface";
import { IEventModel } from "../../../../frameworks/database/mongodb/model/event.model";

export interface IEventRepository extends IBaseRepository<IEventModel>{
    findWithAggregation(eventId:string): Promise<any>
    findAttendeesById(eventId:string): Promise<any>
}
