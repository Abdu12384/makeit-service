import { inject, injectable } from "tsyringe"
import { IGetServiceByIdUseCase } from "../../../domain/interface/useCaseInterface/vendor/service/get-service-by-id-usecase.interface"
import { IServiceEntity } from "../../../domain/entities/service.entity"
import { IVendorRepository } from "../../../domain/interface/repositoryInterfaces/users/vendor.repository.interface"
import { IServiceRepository } from "../../../domain/interface/repositoryInterfaces/service/service-repository.interface"









@injectable()
export class GetServiceByIdUseCase implements IGetServiceByIdUseCase {
	constructor(
		@inject("IServiceRepository")
		private _serviceRepository: IServiceRepository ,
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository  
	){}

	async execute(serviceId: string): Promise<any | null> {

     const service = await this._serviceRepository.findOne({ serviceId })

     console.log('service',service)
     if(service){
      const vendor = await this._vendorRepository.findOne({ userId: service.vendorId })
      console.log('vendor',vendor)
      return {
        service,
        vendor
      }
     }  
	}
}