import { inject, injectable } from "tsyringe";
import { IEditServiceUseCase } from "../../../domain/interface/useCaseInterface/vendor/service/edit-service-usecase.interface.js";
import { IServiceRepository } from "../../../domain/interface/repositoryInterfaces/service/service-repository.interface.js";
import { IServiceEntity } from "../../../domain/entities/service.entity.js";
import { CustomError } from "../../../domain/utils/custom.error.js";  
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";









@injectable()
export class EditServiceUseCase implements IEditServiceUseCase{
    constructor(
        @inject("IServiceRepository")
        private _serviceRepository: IServiceRepository
    ){}
    
    async execute(serviceId: string, data: Partial<IServiceEntity>): Promise<void> {
        const service = await this._serviceRepository.findOne({serviceId})
        console.log('service',service)
        if(!service){
            throw new CustomError(
                ERROR_MESSAGES.SERVICE_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        await this._serviceRepository.update(
          service,
          {
            ...data
          }
        )
        
    }
}
