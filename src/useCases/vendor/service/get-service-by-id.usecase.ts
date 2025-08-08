import { inject, injectable } from "tsyringe"
import { IGetServiceByIdUseCase } from "../../../domain/interface/useCaseInterface/vendor/service/get-service-by-id-usecase.interface"
import { IVendorRepository } from "../../../domain/interface/repositoryInterfaces/users/vendor.repository.interface"
import { IServiceRepository } from "../../../domain/interface/repositoryInterfaces/service/service-repository.interface"
import { IServiceWithVendor } from "../../../domain/entities/DTO/service-with-vendor.dto"









@injectable()
export class GetServiceByIdUseCase implements IGetServiceByIdUseCase {
	constructor(
		@inject("IServiceRepository")
		private _serviceRepository: IServiceRepository ,
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository  
	){}

	async execute(serviceId: string): Promise<IServiceWithVendor | null> {

     const service = await this._serviceRepository.findOne({ serviceId })

     if(service){
      const vendor = await this._vendorRepository.findOne({ userId: service.vendorId })
      return {
        service,
        vendor
      }
     }  
     return null
	}
}