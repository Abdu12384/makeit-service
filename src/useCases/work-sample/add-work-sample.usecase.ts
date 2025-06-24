import { inject, injectable } from "tsyringe";
import { IAddWorkSampleUseCase } from "../../domain/interface/useCaseInterface/work-sample/add-work-sample-usecase.interface";
import { IWorkSampleRepository } from "../../domain/interface/repositoryInterfaces/work-sample/work-sample-repository.interface";
import { IWorkSampleEntity } from "../../domain/entities/worksample.entity";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";






@injectable()
export class AddWorkSampleUseCase implements IAddWorkSampleUseCase {
    
    constructor(
        @inject("IWorkSampleRepository")
        private _workSampleRepository: IWorkSampleRepository,
    
    ){}

    async execute(data: Partial<IWorkSampleEntity>): Promise<void> {

            const {title, description, images, vendorId} = data
            if(!title || !description || !images || !vendorId){
                throw new CustomError(
                  ERROR_MESSAGES.MISSING_PARAMETERS,
                  HTTP_STATUS.BAD_REQUEST
                  )
            }
            const workSampleId = generateUniqueId("workSample")
            await this._workSampleRepository.save({
                ...data,
               workSampleId,
            })
       
    }
}