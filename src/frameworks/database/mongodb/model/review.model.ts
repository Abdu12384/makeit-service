import { model } from "mongoose";
import { IReviewEntity } from "../../../../domain/entities/review.entity";
import { reviewSchema } from "../schema/review.schema";




export interface IReviewModel extends IReviewEntity {}




export const reviewModel = model<IReviewEntity>("review", reviewSchema)