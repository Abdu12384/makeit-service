import { ICategoryRepository } from "../../../domain/interface/repositoryInterfaces/admin/category-repository.interface.js";
import { BaseRepository } from "../base.repository.js";
import { CategoryModel, ICategoryModel } from "../../../frameworks/database/mongodb/model/category.model.js";
import { injectable } from "tsyringe";




@injectable() 
export class CategoryRepository extends BaseRepository<ICategoryModel> implements ICategoryRepository {
   constructor(){
     super(CategoryModel)
   }  
}