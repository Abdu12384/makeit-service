import { IWorkSampleEntity } from "../../../entities/worksample.entity";

export interface IAddWorkSampleUseCase {
    execute(data: Partial<IWorkSampleEntity>): Promise<void>
}











