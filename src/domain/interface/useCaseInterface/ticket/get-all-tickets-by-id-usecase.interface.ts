import { ITicketEntity } from "../../../entities/ticket.entity";


export interface IGetAllTicketsByIdUseCase {
    execute(userId: string,pageNumber:number,pageSize:number,status:string): Promise<{tickets:ITicketEntity[],total:number}>  
} 