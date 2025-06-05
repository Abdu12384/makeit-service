import { inject, injectable } from "tsyringe"
import { IUpdateStatusCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/update-category-usecase.interface"
import { ICategoryRepository } from "../../domain/interface/repositoryInterfaces/admin/category-repository.interface"







@injectable()
export class UpdateStatusCategoryUseCase implements IUpdateStatusCategoryUseCase{
   constructor(
      @inject("ICategoryRepository")
      private _categoryRepository: ICategoryRepository
   ){}
      
   async execute(categoryId:string,status:string): Promise<any> {
      console.log('data',categoryId)
      const category = await this._categoryRepository.update(
        {categoryId},
        {status}
      )
       console.log('category',category)
      return category
   }
}



