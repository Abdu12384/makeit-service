import { IBaseRepository } from "../base-repository.interface";
import { ITicketEntity } from "../../../entities/ticket.entity";

export interface ITicketRepository extends IBaseRepository<ITicketEntity> {
  getAllTicketsById(userId: string,skip:number,limit:number,sort:any): Promise<{items:ITicketEntity[],total:number}>;
  findOneWithPopulate(filter:any): Promise<ITicketEntity>;
}

    