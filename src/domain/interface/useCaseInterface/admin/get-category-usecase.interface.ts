import { CategoryDTO } from "../../../../shared/dtos/category.dto";
import { ICategoryEntity } from "../../../entities/category.entity";

export interface IGetCategoryUseCase{
   execute(pageNumber: number, pageSize: number, search: string, role: string): Promise<{total:number,items:CategoryDTO[]}>
}