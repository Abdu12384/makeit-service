import { ICategoryEntity } from "../../../entities/category.entity";
import { CreateCategoryDTO } from "../../../../shared/constants";

export interface ICategoryUseCase{
    execute(data: CreateCategoryDTO): Promise<ICategoryEntity>
}
