import { IServiceEntity } from "../../../entities/service.entity";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IServiceRepository extends IBaseRepository<IServiceEntity> {
    findAllWithPopulate(filter: any, skip: number, limit: number, sort: any): Promise<{ items: any[], total: number }>;
}
