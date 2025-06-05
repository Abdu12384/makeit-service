import { inject, injectable } from "tsyringe";
import { IWorkSampleEntity } from "../../domain/entities/worksample.entity.js";
import { IUpdateWorkSampleUseCase } from "../../domain/interface/useCaseInterface/work-sample/update-work-sample-usecase.interface.js";
import { IWorkSampleRepository } from "../../domain/interface/repositoryInterfaces/work-sample/work-sample-repository.interface.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";











@injectable()
export class UpdateWorkSampleUseCase implements IUpdateWorkSampleUseCase {
    
    constructor(
        @inject("IWorkSampleRepository")
        private _workSampleRepository: IWorkSampleRepository,
    ){}

    async execute(workSampleId: string, data: Partial<IWorkSampleEntity>): Promise<void> {
        const workSample = await this._workSampleRepository.findOne({workSampleId})
        if(!workSample){
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        await this._workSampleRepository.update(
          {workSampleId},
          {
            ...data
          }
        )
    }
}