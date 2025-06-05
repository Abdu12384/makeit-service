import { IReviewEntity } from "../../../entities/review.entity";
import { IBaseRepository } from "../base-repository.interface";








export interface IReviewRepository extends IBaseRepository<IReviewEntity> {
    findAllWithPopulate(filter: any, skip: number, limit: number, sort:any): Promise<any>
}    
