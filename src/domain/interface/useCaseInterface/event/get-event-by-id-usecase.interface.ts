
import { IEventEntity } from "../../../entities/event.entity";
import { IVendorEntity } from "../../../entities/vendor.entity";

export interface IGetEventByIdUseCase{
  execute(eventId:string):Promise<IEventEntity|IVendorEntity>
}