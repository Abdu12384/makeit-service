import { model } from "mongoose";
import { IReviewEntity } from "../../../../domain/entities/review.entity.js";
import { reviewSchema } from "../schema/review.schema.js";




export interface IReviewModel extends IReviewEntity {}




export const reviewModel = model<IReviewEntity>("review", reviewSchema)