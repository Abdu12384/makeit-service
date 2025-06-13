import { ITicketEntity } from "../../../entities/ticket.entity";


export interface IGetAllTicketsByIdUseCase {
    execute(userId: string,pageNumber:number,pageSize:number): Promise<{tickets:ITicketEntity[],total:number}>  
} 