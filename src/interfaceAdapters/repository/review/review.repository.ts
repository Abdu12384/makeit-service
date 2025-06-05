import { BaseRepository } from "../base.repository.js";
import { IReviewEntity } from "../../../domain/entities/review.entity.js";
import { IReviewRepository } from "../../../domain/interface/repositoryInterfaces/review/review-repository.interface.js";
import { injectable } from "tsyringe";
import { reviewModel } from "../../../frameworks/database/mongodb/model/review.model.js";








@injectable()
export class ReviewRepository extends BaseRepository<IReviewEntity> implements IReviewRepository {
    
    constructor(){
        super(reviewModel)
    }

   async findAllWithPopulate(filter: any, skip: number, limit: number, sort:any){
    const pipeline = [
        {
            $match: filter
        },
        {
            $lookup: {
                from: "clients",
                localField: "reviewerId",
                foreignField: "userId",
                as: "client"
            }
        },
        {
            $unwind: {
                path: "$client",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                reviewId: 1,
                targetId: 1,
                targetType: 1,
                rating: 1,
                comment: 1,
                date: 1,
                createdAt: 1,
                updatedAt: 1,
                client: {
                    name: 1,
                    profileImage: 1
                }
            }
        },
        {
            $sort: sort
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]
    const countPipeline = [
        {
            $match: filter
        },
        {
            $count: "total"
        }
    ]
    const [items, countResult] = await Promise.all([
        this.model.aggregate(pipeline),
        this.model.aggregate(countPipeline)
    ])
    return {
        items,
        total: countResult[0]?.total || 0
    }
   }
}