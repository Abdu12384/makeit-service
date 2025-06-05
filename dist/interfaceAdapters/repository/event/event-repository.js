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
import { eventModel } from "../../../frameworks/database/mongodb/model/event.model.js";
import { injectable } from "tsyringe";
let EventRepository = class EventRepository extends BaseRepository {
    constructor() {
        super(eventModel);
    }
    async findWithAggregation(eventId) {
        const result = await this.model.aggregate([
            {
                $match: { eventId: eventId }
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
                    maxTicketPerUser: 1,
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
    }
    async findAttendeesById(eventId) {
        const result = await this.model.aggregate([
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
        return result[0]?.attendees || [];
    }
};
EventRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], EventRepository);
export { EventRepository };
//# sourceMappingURL=event-repository.js.map