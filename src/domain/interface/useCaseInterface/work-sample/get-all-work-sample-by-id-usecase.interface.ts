import { IWorkSampleEntity } from "../../../entities/worksample.entity";

export interface IGetAllWorkSampleByIdUseCase {
    execute(vendorId: string, pageNumber: number, pageSize: number): Promise<{ workSamples: IWorkSampleEntity[]; totalWorkSamples: number; }>
}