import { inject, injectable } from "tsyringe"
import { ICategoryRepository } from "../../domain/interface/repositoryInterfaces/admin/category-repository.interface"
import { IEditCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/edit-category-usecase.interface"
import { CustomError } from "../../domain/utils/custom.error"
import { HTTP_STATUS } from "../../shared/constants"



@injectable()
export class EditCategoryUseCase implements IEditCategoryUseCase{
   constructor(
      @inject("ICategoryRepository")
      private _categoryRepository: ICategoryRepository
   ){}
   
   async execute(id:string,title:string,description:string,image?:string):Promise<void>{
      const category = await this._categoryRepository.findOne({
         categoryId:id
      })
      const existingCategory = await this._categoryRepository.findOne({
        title: { $regex: `^${title?.trim()}$`, $options: "i" }, 
      });
    
      if (existingCategory && existingCategory.categoryId !== id) {
        throw new CustomError(
          "Category title already exists",
          HTTP_STATUS.CONFLICT
        );
      }
      await this._categoryRepository.update(
        { categoryId:category?.categoryId},
        {
          title,
          description,
          image
        }
      )
   }
}   