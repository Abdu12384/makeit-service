export interface IVerifyTicketUseCase {
    execute(ticketId: string, eventId: string): Promise<any>
}