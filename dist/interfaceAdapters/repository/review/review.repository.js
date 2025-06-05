var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseRepository } from "../base.repository.js";
import { injectable } from "tsyringe";
import { reviewModel } from "../../../frameworks/database/mongodb/model/review.model.js";
let ReviewRepository = class ReviewRepository extends BaseRepository {
    constructor() {
        super(reviewModel);
    }
    async findAllWithPopulate(filter, skip, limit, sort) {
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
        ];
        const countPipeline = [
            {
                $match: filter
            },
            {
                $count: "total"
            }
        ];
        const [items, countResult] = await Promise.all([
            this.model.aggregate(pipeline),
            this.model.aggregate(countPipeline)
        ]);
        return {
            items,
            total: countResult[0]?.total || 0
        };
    }
};
ReviewRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], ReviewRepository);
export { ReviewRepository };
//# sourceMappingURL=review.repository.js.map