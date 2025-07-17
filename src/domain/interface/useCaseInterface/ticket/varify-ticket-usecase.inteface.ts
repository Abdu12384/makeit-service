import { ITicketEntity } from "../../../entities/ticket.entity";

export interface IVerifyTicketUseCase {
    execute(ticketId: string, eventId: string,status:string): Promise<ITicketEntity | null>
}