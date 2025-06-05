
export interface IConfirmTicketUseCase {
    execute(ticket:any, paymentIntentId: string, vendorId: string): Promise<{ stripeClientId: string, createdTicket: any }>;
}