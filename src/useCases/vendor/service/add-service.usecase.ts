import { inject, injectable } from "tsyringe";
import { IAddServiceUseCase } from "../../../domain/interface/useCaseInterface/vendor/service/add-service-usecase.interface.js";
import { IServiceEntity } from "../../../domain/entities/service.entity.js";
import { IServiceRepository } from "../../../domain/interface/repositoryInterfaces/service/service-repository.interface.js";
import { CustomError } from "../../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";





@injectable()
export class AddServiceUseCase implements IAddServiceUseCase{
    constructor(
     @inject("IServiceRepository")
     private _serviceRepository: IServiceRepository
    ){}


    async execute(data: Partial<IServiceEntity>): Promise<void> {
        
         const isServiceExisting = await this._serviceRepository.findOne({
            vendorId: data.vendorId,
			serviceTitle: { $regex: `^${data.serviceTitle?.trim()}$`, $options: "i" }, 
         }) 
 
         if(isServiceExisting){
            throw new CustomError(
               ERROR_MESSAGES.SERVICE_EXISTS,
               HTTP_STATUS.CONFLICT
            )
         }   
         console.log('service added',data)  
         
         const serviceId = generateUniqueId("service")  

        await this._serviceRepository.save(
            {
                ...data,
                serviceId
            }
        )
    }
  
}