import { IReviewEntity } from "../../../entities/review.entity";
import { IBaseRepository } from "../base-repository.interface";
import { FilterType, SortType } from "../../../../shared/constants";







export interface IReviewRepository extends IBaseRepository<IReviewEntity> {
    findAllWithPopulate(filter: FilterType, skip: number, limit: number, sort:SortType): Promise<{items:IReviewEntity[],total:number}>
}    
