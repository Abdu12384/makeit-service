import { inject, injectable } from "tsyringe";
import { IEditServiceUseCase } from "../../../domain/interface/useCaseInterface/vendor/service/edit-service-usecase.interface";
import { IServiceRepository } from "../../../domain/interface/repositoryInterfaces/service/service-repository.interface";
import { IServiceEntity } from "../../../domain/entities/service.entity";
import { CustomError } from "../../../domain/utils/custom.error";  
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";




@injectable()
export class EditServiceUseCase implements IEditServiceUseCase{
    constructor(
        @inject("IServiceRepository")
        private _serviceRepository: IServiceRepository
    ){}
    
    async execute(serviceId: string, data: Partial<IServiceEntity>): Promise<void> {
        const service = await this._serviceRepository.findOne({serviceId})
        if(!service){
            throw new CustomError(
                ERROR_MESSAGES.SERVICE_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        await this._serviceRepository.update(
          {serviceId},
          {
            ...data
          }
        )
        
    }
}
