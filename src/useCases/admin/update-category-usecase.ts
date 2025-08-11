import { inject, injectable } from "tsyringe"
import { IUpdateStatusCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/update-category-usecase.interface"
import { ICategoryRepository } from "../../domain/interface/repositoryInterfaces/admin/category-repository.interface"
import { ICategoryEntity } from "../../domain/entities/category.entity"
import { plainToInstance } from "class-transformer"
import { CategoryDTO } from "../../shared/dtos/category.dto"







@injectable()
export class UpdateStatusCategoryUseCase implements IUpdateStatusCategoryUseCase{
   constructor(
      @inject("ICategoryRepository")
      private _categoryRepository: ICategoryRepository
   ){}
      
   async execute(categoryId:string,status:string): Promise<ICategoryEntity | null> {
      const category = await this._categoryRepository.update(
        {categoryId},
        {status}
      )

      const categories = plainToInstance(CategoryDTO, category, { excludeExtraneousValues: true }); 
      
      return categories
   }
}



 