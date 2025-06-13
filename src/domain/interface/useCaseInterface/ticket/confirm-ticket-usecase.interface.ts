import { ITicketEntity } from "../../../entities/ticket.entity";

export interface IConfirmTicketUseCase {
    execute(ticket:ITicketEntity, paymentIntentId: string, vendorId: string): Promise<{ stripeClientId: string, createdTicket: ITicketEntity }>;
}