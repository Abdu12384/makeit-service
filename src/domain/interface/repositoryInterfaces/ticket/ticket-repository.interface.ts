import { IBaseRepository } from "../base-repository.interface";
import { ITicketEntity } from "../../../entities/ticket.entity";
import { FilterType, SortType } from "../../../../shared/constants";

export interface ITicketRepository extends IBaseRepository<ITicketEntity> {
  getAllTicketsById(userId: string,skip:number,limit:number,sort:SortType): Promise<{items:ITicketEntity[],total:number}>;
  findOneWithPopulate(filter:FilterType): Promise<ITicketEntity>;
}

    