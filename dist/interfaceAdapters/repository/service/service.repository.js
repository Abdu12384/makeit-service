var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import { serviceModel } from "../../../frameworks/database/mongodb/model/service.model.js";
let ServiceRepository = class ServiceRepository extends BaseRepository {
    constructor() {
        super(serviceModel);
    }
    async findAllWithPopulate(filter, skip, limit, sort) {
        const pipeline = [
            { $match: filter },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "categoryId",
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendorId",
                    foreignField: "userId",
                    as: "vendor"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            { $match: { "category.status": "active" } },
            {
                $project: {
                    serviceId: 1,
                    serviceTitle: 1,
                    additionalHourFee: 1,
                    serviceDescription: 1,
                    servicePrice: 1,
                    serviceDuration: 1,
                    yearsOfExperience: 1,
                    vendorId: 1,
                    categoryId: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    termsAndCondition: 1,
                    cancellationPolicy: 1,
                    category: {
                        title: 1,
                        image: 1,
                        status: 1,
                        categoryId: 1
                    },
                    vendor: {
                        name: 1,
                        email: 1,
                        profileImage: 1
                    }
                }
            },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
        ];
        const countPipeline = [
            { $match: filter },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "categoryId",
                    as: "category"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: false } },
            { $match: { "category.status": "active" } },
            { $count: "total" }
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
ServiceRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], ServiceRepository);
export { ServiceRepository };
//# sourceMappingURL=service.repository.js.map