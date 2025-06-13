import { inject, injectable } from "tsyringe"
import { IGetAllReviewUseCase } from "../../domain/interface/useCaseInterface/review/get-all-review-usecase.interface"
import { IReviewRepository } from "../../domain/interface/repositoryInterfaces/review/review-repository.interface"
import { IReviewEntity } from "../../domain/entities/review.entity";







@injectable()
export class GetAllReviewUseCase implements IGetAllReviewUseCase {
    constructor(
        @inject("IReviewRepository")
        private _reviewRepository: IReviewRepository,
    ){}

    async execute(targetId: string, targetType: string,pageNumber:number,pageSize:number): Promise<{reviews:IReviewEntity[],total:number}> {

       const validPageNumber = Math.max(1, pageNumber || 1);
       const validPageSize = Math.max(1, pageSize || 10);
       const skip = (validPageNumber - 1) * validPageSize;
       const limit = validPageSize;
       const sort = { createdAt: -1 as -1 };

        const {items , total} = await this._reviewRepository.findAllWithPopulate(
            {
                targetId,
                targetType
            },
            skip,
            limit,
            sort
        )
        return {
            reviews:items,
            total:Math.ceil(total/validPageSize)
        }
    }
}