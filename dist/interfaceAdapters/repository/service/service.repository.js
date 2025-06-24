"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../base.repository");
const service_model_1 = require("../../../frameworks/database/mongodb/model/service.model");
let ServiceRepository = class ServiceRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(service_model_1.serviceModel);
    }
    findAllWithPopulate(filter, skip, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
            const [items, countResult] = yield Promise.all([
                this.model.aggregate(pipeline),
                this.model.aggregate(countPipeline)
            ]);
            return {
                items,
                total: ((_a = countResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0
            };
        });
    }
};
exports.ServiceRepository = ServiceRepository;
exports.ServiceRepository = ServiceRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], ServiceRepository);
//# sourceMappingURL=service.repository.js.map