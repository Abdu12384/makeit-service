
export interface IEditCategoryUseCase {
   execute(id:string,title:string,description:string,image?:string):Promise<void>
}