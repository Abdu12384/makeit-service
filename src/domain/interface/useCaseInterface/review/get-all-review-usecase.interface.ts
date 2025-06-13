import { IReviewEntity } from "../../../entities/review.entity";

export interface IGetAllReviewUseCase {
    execute(targetId: string, targetType: string,pageNumber:number,pageSize:number): Promise<{reviews:IReviewEntity[],total:number}>
}