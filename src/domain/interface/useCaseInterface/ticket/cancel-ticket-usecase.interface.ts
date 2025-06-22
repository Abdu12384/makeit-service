export interface ICancelTicketUseCase {
    execute(ticketId:string,cancelCount:number):Promise<void>
}