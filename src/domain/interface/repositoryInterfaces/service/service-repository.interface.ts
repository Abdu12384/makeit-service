import { FilterType, PopulatedItem, SortType } from "../../../../shared/constants";
import { IServiceEntity } from "../../../entities/service.entity";
import { IBaseRepository } from "../base-repository.interface";



export interface IServiceRepository extends IBaseRepository<IServiceEntity> {
    findAllWithPopulate(filter: FilterType, skip: number, limit: number, sort: SortType): Promise<{ items: PopulatedItem[], total: number }>;
}
