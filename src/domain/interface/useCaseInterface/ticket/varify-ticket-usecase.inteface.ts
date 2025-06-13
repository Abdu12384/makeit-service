import { ITicketEntity } from "../../../entities/ticket.entity";

export interface IVerifyTicketUseCase {
    execute(ticketId: string, eventId: string): Promise<ITicketEntity | null>
}