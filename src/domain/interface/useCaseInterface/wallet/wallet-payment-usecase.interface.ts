import { TicketDto } from "../../../../shared/dtos/request/ticket-requst.dto";
import { ITicketEntity } from "../../../entities/ticket.entity";

export interface IWalletPaymentUseCase {
    execute(ticket:TicketDto,amount:number,event:string,type:string,totalTicketCount:number,vendorId:string,clientId:string,paymentMethod:string):Promise<ITicketEntity>
}