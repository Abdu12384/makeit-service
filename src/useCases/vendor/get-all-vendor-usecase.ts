import { inject, injectable } from "tsyringe";
import { IGetAllVendorUseCase } from "../../domain/interface/useCaseInterface/vendor/get-all-vendor-usecase.interface";
import { IPaginatedVendor } from "../../domain/entities/paginated/paginated-vendor.entity";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { plainToInstance } from "class-transformer";
import { VendorDTO } from "../../shared/dtos/vendor.dto";




@injectable()
export class GetAllVendorUseCase implements IGetAllVendorUseCase {

     constructor(
     
      @inject("IVendorRepository")
      private _vendorRepository: IVendorRepository

     ){}

     async execute(forType: string, pageNumber: number, pageSize: number, searchTerm: string): Promise<IPaginatedVendor> {
         let filter: Record<string, unknown> = {}
         if(searchTerm) {
           filter.$or =[
              {name:{$regex: searchTerm, $options:"i"}},
              {email:{$regex: searchTerm, $options:"i"}}
           ]
         }

         filter.vendorStatus = { $ne: "approved" };

         const validPageNumber = Math.max(1,pageNumber || 1)
         const validPageSize = Math.max(1, pageSize || 10);
         const skip = (validPageNumber - 1) * validPageNumber;
         const limit = validPageSize;
         
         const {items, total} = await this._vendorRepository.findAll(
            {
              ...filter,
            
            },
            skip,
            limit
         )
         const vendors = plainToInstance(VendorDTO, items as [], { excludeExtraneousValues: true }); 

         const response : IPaginatedVendor ={
           vendor: vendors,
           total: Math.ceil(total / validPageSize)
         }



         return response
     }

}