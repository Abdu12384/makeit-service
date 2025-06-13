import { inject, injectable } from "tsyringe";
import { IGetAllWorkSampleByIdUseCase } from "../../domain/interface/useCaseInterface/work-sample/get-all-work-sample-by-id-usecase.interface";
import { IWorkSampleRepository } from "../../domain/interface/repositoryInterfaces/work-sample/work-sample-repository.interface";
import { IWorkSampleEntity } from "../../domain/entities/worksample.entity";











@injectable()
export class GetAllWorkSampleByIdUseCase implements IGetAllWorkSampleByIdUseCase {
    
    constructor(
        @inject("IWorkSampleRepository")
        private _workSampleRepository: IWorkSampleRepository,
    ){}
    
    async execute(vendorId: string, pageNumber: number, pageSize: number): Promise<{ workSamples: IWorkSampleEntity[]; totalWorkSamples: number; }> {

        const validPageNumber = Math.max(1, pageNumber || 1);
        const validPageSize = Math.max(1, pageSize || 10);
        const skip = (validPageNumber - 1) * validPageSize;
        const limit = validPageSize;
        const sort: Record<string, 1 | -1> = { createdAt: -1 as -1 };

        const {items , total} = await this._workSampleRepository.findAll({vendorId},skip,limit,sort)
        return {
            workSamples:items,
            totalWorkSamples: Math.ceil(total / validPageSize)
        }
    }
}