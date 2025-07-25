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
exports.EventRepository = void 0;
const base_repository_1 = require("../base.repository");
const event_model_1 = require("../../../frameworks/database/mongodb/model/event.model");
const tsyringe_1 = require("tsyringe");
let EventRepository = class EventRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(event_model_1.eventModel);
    }
    findWithAggregation(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.aggregate([
                {
                    $match: {
                        eventId: eventId,
                    }
                },
                {
                    $lookup: {
                        from: "vendors",
                        localField: "hostedBy",
                        foreignField: "userId",
                        as: "vendorDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$vendorDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        eventId: 1,
                        hostedBy: 1,
                        address: 1,
                        attendees: 1,
                        date: 1,
                        location: 1,
                        pricePerTicket: 1,
                        totalTicket: 1,
                        ticketPurchased: 1,
                        status: 1,
                        startTime: 1,
                        endTime: 1,
                        venueName: 1,
                        category: 1,
                        posterImage: 1,
                        title: 1,
                        attendeesCount: 1,
                        maxTicketsPerUser: 1,
                        isActive: 1,
                        description: 1,
                        vendorDetails: {
                            userId: 1,
                            name: 1,
                            email: 1,
                            phone: 1,
                            profileImage: 1
                        }
                    }
                }
            ]);
            return result[0] || null;
        });
    }
    findAttendeesById(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.model.aggregate([
                {
                    $match: { eventId: eventId }
                },
                {
                    $unwind: "$attendees"
                },
                {
                    $lookup: {
                        from: "clients",
                        localField: "attendees",
                        foreignField: "userId",
                        as: "attendeeDetails"
                    }
                },
                {
                    $unwind: "$attendeeDetails"
                },
                {
                    $group: {
                        _id: "$eventId",
                        attendees: { $push: "$attendeeDetails" }
                    }
                }
            ]);
            return (((_a = result[0]) === null || _a === void 0 ? void 0 : _a.attendees) || []).reverse();
        });
    }
    findAllByLocation(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { lat, lng, radius } = params;
            const result = yield this.model.find({
                location: {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lng, lat],
                        },
                        $maxDistance: radius * 1000,
                    },
                },
                isActive: true
            });
            return result;
        });
    }
};
exports.EventRepository = EventRepository;
exports.EventRepository = EventRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], EventRepository);
//# sourceMappingURL=event-repository.js.map