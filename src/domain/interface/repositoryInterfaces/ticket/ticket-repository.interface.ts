import { IBaseRepository } from "../base-repository.interface";
import { ITicketEntity } from "../../../entities/ticket.entity";
import { FilterType, SortType } from "../../../../shared/constants";
import { IClientEntity } from "../../../entities/client.entity";

export interface ITicketRepository extends IBaseRepository<ITicketEntity> {
  getAllTicketsById(filter:FilterType,skip:number,limit:number,sort:SortType): Promise<{items:ITicketEntity[],total:number}>;
  findOneWithPopulate(filter:FilterType): Promise<ITicketEntity>;
  findAllWithClientDetails(eventId: string, skip: number, limit: number): Promise<{ items: IClientEntity[], total: number }>;
}

    