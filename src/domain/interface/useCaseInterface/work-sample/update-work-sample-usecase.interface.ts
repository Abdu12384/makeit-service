import { IWorkSampleEntity } from "../../../entities/worksample.entity";

export interface IUpdateWorkSampleUseCase {
    execute(workSampleId: string, data: Partial<IWorkSampleEntity>): Promise<void>
}