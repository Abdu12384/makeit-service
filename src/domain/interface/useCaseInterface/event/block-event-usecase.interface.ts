export interface IBlockEventUseCase{
  blockEvent(eventId: string): Promise<void>
}