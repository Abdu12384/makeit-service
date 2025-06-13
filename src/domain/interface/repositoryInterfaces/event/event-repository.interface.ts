import { IBaseRepository } from "../base-repository.interface";
import { IEventModel } from "../../../../frameworks/database/mongodb/model/event.model";
import { IVendorEntity } from "../../../entities/vendor.entity";
import { IClientEntity } from "../../../entities/client.entity";
import { IEventEntity } from "../../../entities/event.entity";

export interface IEventRepository extends IBaseRepository<IEventModel>{
    findWithAggregation(eventId:string): Promise<IVendorEntity|IEventEntity>
    findAttendeesById(eventId:string): Promise<IClientEntity[]>
}
