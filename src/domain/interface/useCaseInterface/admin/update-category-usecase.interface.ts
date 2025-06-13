import { ICategoryEntity } from "../../../entities/category.entity";

export interface IUpdateStatusCategoryUseCase {
   execute(categoryId:string,status:string):Promise<ICategoryEntity | null>
}