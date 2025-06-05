export interface IGetEventsAttendeesByIdUseCase{
  execute(eventId:string):Promise<void>
}
  