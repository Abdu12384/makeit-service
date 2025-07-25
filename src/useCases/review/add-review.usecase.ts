import { inject, injectable } from "tsyringe";
import { IAddReviewUseCase } from "../../domain/interface/useCaseInterface/review/add-review-usecase.interface";
import { IReviewEntity } from "../../domain/entities/review.entity";
import { IReviewRepository } from "../../domain/interface/repositoryInterfaces/review/review-repository.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";












@injectable()
export class AddReviewUseCase implements IAddReviewUseCase {
    
    constructor(
        @inject("IReviewRepository")
        private _reviewRepository: IReviewRepository,
    ){}

    async execute(data: Partial<IReviewEntity>): Promise<void> {
        const review = await this._reviewRepository.findOne({targetId:data.targetId})
        // if(review){
        //     throw new CustomError(
        //         ERROR_MESSAGES.REVIEW_ALREADY_EXISTS,
        //         HTTP_STATUS.BAD_REQUEST
        //     )
        // }
        await this._reviewRepository.save(data)
    }
}
    
    