import { IReviewEntity } from "../../../entities/review.entity";

export interface IAddReviewUseCase {
    execute(data: Partial<IReviewEntity>): Promise<void>;
}