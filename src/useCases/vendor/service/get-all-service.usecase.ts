import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../domain/interface/repositoryInterfaces/service/service-repository.interface";
import { IGetAllServicesUseCase } from "../../../domain/interface/useCaseInterface/vendor/service/get-all-service-usecase.interface";
import { IPaginatedService } from "../../../domain/entities/paginated/paginated-service.entity";




@injectable()
export class GetAllServiceUseCase implements IGetAllServicesUseCase {

    constructor(        
        @inject("IServiceRepository")
        private _serviceRepository: IServiceRepository
    ) {}

    async execute(pageNumber: number, pageSize: number, search: string, role: string, vendorId: string): Promise<IPaginatedService | null> {

      const validPageNumber = Math.max(1, pageNumber || 1);
      const validPageSize = Math.max(1, pageSize || 10);
      const skip = (validPageNumber - 1) * validPageSize; 


      let filter: any = {};

      if (role !== "vendor") {
      filter.status = "active";
     }

     
     if (search) {
       filter.serviceTitle = { $regex: search, $options: "i" };
      }
      if (vendorId) {
        filter.vendorId = vendorId;
      } 
      
      const limit = validPageSize;

      const sort = { createdAt: -1 } as const;  

      const {items , total} = await this._serviceRepository.findAllWithPopulate(filter,skip,limit,sort)
          const response: IPaginatedService = {
            services: items,
            total: Math.ceil(total / validPageSize)
          } 
          return response 
    }
  }             