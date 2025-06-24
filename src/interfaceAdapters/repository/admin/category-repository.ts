import { ICategoryRepository } from "../../../domain/interface/repositoryInterfaces/admin/category-repository.interface";
import { BaseRepository } from "../base.repository";
import { CategoryModel, ICategoryModel } from "../../../frameworks/database/mongodb/model/category.model";
import { injectable } from "tsyringe";




@injectable() 
export class CategoryRepository extends BaseRepository<ICategoryModel> implements ICategoryRepository {
   constructor(){
     super(CategoryModel)
   }  
}