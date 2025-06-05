
export interface IGetCategoryUseCase{
   execute(pageNumber: number, pageSize: number, search: string, role: string): Promise<any>
}