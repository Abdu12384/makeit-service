import { inject, injectable } from "tsyringe"
import { ICategoryRepository } from "../../domain/interface/repositoryInterfaces/admin/category-repository.interface"
import { IGetCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/get-category-usecase.interface"





@injectable()
export class GetAllCategoryUseCase implements IGetCategoryUseCase{
    
  constructor(
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ){}

  async execute(pageNumber: number, pageSize: number, search: string, role: string): Promise<any> {
    const validPage = Math.max(1, pageNumber || 1);  
    const validLimit = Math.max(1, pageSize || 10);
    const skip = (validPage - 1) * validLimit;

    console.log(validPage,validLimit,skip)
  
    const filter: any = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (role === "vendor") {
      filter.status = "active";
    }
    const sort = { createdAt: -1 };
  
    const {total,items} = await this._categoryRepository.findAll(filter, skip, validLimit,sort);
    return {
      total: Math.ceil(total / validLimit),
      items,
    };
  }
  
}
    

