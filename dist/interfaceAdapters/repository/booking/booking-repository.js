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
exports.BookingRepository = void 0;
const tsyringe_1 = require("tsyringe");
const booking_model_1 = require("../../../frameworks/database/mongodb/model/booking.model");
const base_repository_1 = require("../base.repository");
let BookingRepository = class BookingRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(booking_model_1.BookingModel);
    }
    findAllWithVendorClient(filter, skip, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const pipeline = [
                { $match: filter },
                { $sort: sort },
                {
                    $facet: {
                        data: [
                            {
                                $lookup: {
                                    from: "vendors",
                                    localField: "vendorId",
                                    foreignField: "userId",
                                    as: "vendor"
                                }
                            },
                            { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: "clients",
                                    localField: "clientId",
                                    foreignField: "userId",
                                    as: "client"
                                }
                            },
                            { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
                            {
                                $lookup: {
                                    from: "services",
                                    localField: "serviceId",
                                    foreignField: "serviceId",
                                    as: "service"
                                }
                            },
                            { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },
                            {
                                $project: {
                                    bookingId: 1,
                                    serviceId: 1,
                                    vendorId: 1,
                                    clientId: 1,
                                    date: 1,
                                    phone: 1,
                                    email: 1,
                                    status: 1,
                                    vendorApproval: 1,
                                    balanceAmount: 1,
                                    paymentStatus: 1,
                                    isComplete: 1,
                                    createdAt: 1,
                                    updatedAt: 1,
                                    vendor: {
                                        userId: 1,
                                        name: 1,
                                        email: 1,
                                        phone: 1,
                                        profilePicture: 1
                                    },
                                    client: {
                                        userId: 1,
                                        name: 1,
                                        email: 1,
                                        profilePicture: 1,
                                        phone: 1,
                                    },
                                    service: {
                                        serviceTitle: 1,
                                        servicePrice: 1,
                                        serviceDescription: 1,
                                        serviceDuration: 1,
                                        yearsOfExperience: 1,
                                        additionalHourFee: 1,
                                    }
                                }
                            },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        count: [
                            { $count: "total" }
                        ]
                    }
                }
            ];
            const result = yield booking_model_1.BookingModel.aggregate(pipeline);
            const items = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
            const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.count[0]) === null || _c === void 0 ? void 0 : _c.total) || 0;
            return {
                items,
                total
            };
        });
    }
    findExactApprovedBookingByVendorAndDate(vendorId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedDate = new Date(date); // Convert from string
            const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
            return yield this.model.findOne({
                vendorId,
                vendorApproval: "Approved",
                date: { $gte: startOfDay, $lte: endOfDay },
            });
        });
    }
    checkVendorBookingConflict(vendorId, bookingDate, currentBookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedDate = new Date(bookingDate);
            const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
            const conflict = yield this.model.findOne({
                vendorId,
                vendorApproval: "Approved",
                date: { $gte: startOfDay, $lte: endOfDay },
                bookingId: { $ne: currentBookingId }
            });
            return !!conflict;
        });
    }
    // base.repository.ts
    updateOne(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne(filter, updateData).exec();
        });
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], BookingRepository);
//# sourceMappingURL=booking-repository.js.map