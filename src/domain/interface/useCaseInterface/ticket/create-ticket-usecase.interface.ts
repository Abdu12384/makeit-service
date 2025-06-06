export interface ICreateTicketUseCase {
    execute(ticket:any, paymentIntentId: string, totalAmount: number, totalCount: number, vendorId: string,clientId:string,eventId:string,email:string,phone:string): Promise<{ stripeClientId: string, createdTicket: any }>;
}