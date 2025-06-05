import { inject, injectable } from "tsyringe";
import { ICategoryUseCase } from "../../domain/interface/useCaseInterface/admin/create-category-usecase.interface.js";
import { ICategoryRepository } from "../../domain/interface/repositoryInterfaces/admin/category-repository.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";





@injectable()
export class CategoryUseCase implements ICategoryUseCase{
   constructor(
      @inject("ICategoryRepository")
      private _categoryRepository: ICategoryRepository
   ){}
      
   async execute(data: any): Promise<any> {

      const categoryId = generateUniqueId("category")

      const category = await this._categoryRepository.findOne({
			title: { $regex: `^${data.title?.trim()}$`, $options: "i" }, 
      })

      if(category){
         throw new CustomError(
            "Category already exists",
            HTTP_STATUS.CONFLICT
         )
      }  

      const categoryData = await this._categoryRepository.save({
         categoryId,
            ...data
      })
      return categoryData
   }
}