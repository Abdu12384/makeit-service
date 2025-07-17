import { inject, injectable } from "tsyringe"
import { ICategoryRepository } from "../../domain/interface/repositoryInterfaces/admin/category-repository.interface"
import { IGetCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/get-category-usecase.interface"
import { ICategoryEntity } from "../../domain/entities/category.entity";
import { CategoryDTO } from "../../shared/dtos/category.dto";
import { plainToInstance } from "class-transformer";





@injectable()
export class GetAllCategoryUseCase implements IGetCategoryUseCase{
    
  constructor(
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ){}

  async execute(pageNumber: number, pageSize: number, search: string, role: string): Promise<{total:number,items:CategoryDTO[]}> {
    const validPage = Math.max(1, pageNumber || 1);  
    const validLimit = Math.max(1, pageSize || 10);
    const skip = (validPage - 1) * validLimit;

  
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (role === "vendor") {
      filter.status = "active";
    }
    const sort: Record<string, 1 | -1> = { createdAt: -1 as -1 };
    
    const {total,items} = await this._categoryRepository.findAll(filter, skip, validLimit,sort);

    const categories = plainToInstance(CategoryDTO, items as [], { excludeExtraneousValues: true }); 
    return {
      total: Math.ceil(total / validLimit),
      items:categories,
    };
  }
  
}
    