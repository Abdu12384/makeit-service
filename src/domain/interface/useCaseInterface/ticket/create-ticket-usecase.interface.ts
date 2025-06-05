export interface ICreateTicketUseCase {
    execute(ticket:any, paymentIntentId: string, totalAmount: number, totalCount: number, vendorId: string,clientId:string): Promise<{ stripeClientId: string, createdTicket: any }>;
}