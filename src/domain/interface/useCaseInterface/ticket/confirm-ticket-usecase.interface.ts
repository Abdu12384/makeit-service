import { ITicketEntity } from "../../../entities/ticket.entity";

export interface IConfirmTicketUseCase {
    execute(ticket:ITicketEntity, paymentIntentId: string, vendorId: string): Promise<ITicketEntity | null>;
}