import { ITicketEntity } from "../../../entities/ticket.entity";

export interface ICreateTicketUseCase {
    execute(ticket:ITicketEntity, paymentIntentId: string, totalAmount: number, totalCount: number, vendorId: string,clientId:string,eventId:string,email:string,phone:string): Promise<{ stripeClientId: string, createdTicket: ITicketEntity }>;
}