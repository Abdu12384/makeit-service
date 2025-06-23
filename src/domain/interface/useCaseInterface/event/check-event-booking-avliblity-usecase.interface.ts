export interface ICheckEventBookingAvliblityUseCase{
  execute(eventId:string,userId:string,ticketCount:number):Promise<void>
}