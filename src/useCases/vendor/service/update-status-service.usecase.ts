import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../domain/interface/repositoryInterfaces/service/service-repository.interface.js";
import { IUpdateServiceStatusUseCase } from "../../../domain/interface/useCaseInterface/vendor/service/update-service-status-usecase.interface.js";
import { CustomError } from "../../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../../shared/constants.js";



@injectable()
export class UpdateServiceStatusUseCase implements IUpdateServiceStatusUseCase {
	
   constructor(
      @inject("IServiceRepository")
      private _serviceRepository: IServiceRepository
   ){}  

  async execute(serviceId: string, status: string): Promise<void> {   


    const service = await this._serviceRepository.findOne({serviceId})
    if(!service){
      throw new CustomError(
        "Service not found",
        HTTP_STATUS.NOT_FOUND
      )
    }   
    
    service.status = status
    await this._serviceRepository.update(
      {serviceId},
       service
      )      
    
  }

  async blockService(serviceId: string): Promise<void> {    
    const service = await this._serviceRepository.findOne({serviceId})
    if(!service){
      throw new CustomError(
        "Service not found",
        HTTP_STATUS.NOT_FOUND
      )
    }   
    const newStatus = service.status === "blocked" ? "active" : "blocked";

    await this._serviceRepository.update(
      {serviceId},
       {status: newStatus}
      )      
    
  }
}


