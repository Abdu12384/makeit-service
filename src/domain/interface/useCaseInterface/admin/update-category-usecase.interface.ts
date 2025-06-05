
export interface IUpdateStatusCategoryUseCase {
   execute(categoryId:string,status:string):Promise<void>
}