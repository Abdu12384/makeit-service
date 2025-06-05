export interface ICancelTicketUseCase {
    execute(ticketId:string):Promise<void>
}