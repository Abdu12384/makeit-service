export interface IGetAllEventsUseCase{
  execute(
    pageNumber: number,
    pageSize: number,
    searchTermString: string
  ): Promise<any>
}