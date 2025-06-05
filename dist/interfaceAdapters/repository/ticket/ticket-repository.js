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
import { ticketModel } from "../../../frameworks/database/mongodb/model/ticket.model.js";
import { BaseRepository } from "../base.repository.js";
let TicketRepository = class TicketRepository extends BaseRepository {
    constructor() {
        super(ticketModel);
    }
    async getAllTicketsById(userId, skip, limit, sort) {
        const pipeline = [
            {
                $match: { clientId: userId }
            },
            {
                $lookup: {
                    from: "events",
                    localField: "eventId",
                    foreignField: "eventId",
                    as: "eventDetails"
                }
            },
            {
                $unwind: {
                    path: "$eventDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    eventId: 1,
                    clientId: 1,
                    ticketId: 1,
                    vendorId: 1,
                    ticketPrice: 1,
                    ticketCount: 1,
                    ticketPurchased: 1,
                    qrCodeLink: 1,
                    ticketStatus: 1,
                    totalAmount: 1,
                    paymentStatus: 1,
                    email: 1,
                    phone: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    eventDetails: {
                        eventId: 1,
                        address: 1,
                        attendees: 1,
                        date: 1,
                        totalTicket: 1,
                        ticketPurchased: 1,
                        status: 1,
                        startTime: 1,
                        endTime: 1,
                        venueName: 1,
                        posterImage: 1,
                        title: 1,
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
            { $match: { clientId: userId } },
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
    async findOneWithPopulate(filter) {
        const pipeline = [
            {
                $match: filter
            },
            {
                $lookup: {
                    from: "events",
                    localField: "eventId",
                    foreignField: "eventId",
                    as: "eventDetails"
                }
            },
            {
                $unwind: {
                    path: "$eventDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    eventId: 1,
                    clientId: 1,
                    ticketId: 1,
                    vendorId: 1,
                    ticketPrice: 1,
                    ticketCount: 1,
                    ticketPurchased: 1,
                    qrCodeLink: 1,
                    ticketStatus: 1,
                    totalAmount: 1,
                    paymentStatus: 1,
                    email: 1,
                    phone: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    eventDetails: {
                        eventId: 1,
                        address: 1,
                        attendees: 1,
                        date: 1,
                        totalTicket: 1,
                        ticketPurchased: 1,
                        hostedBy: 1,
                        status: 1,
                        startTime: 1,
                        endTime: 1,
                        venueName: 1,
                        posterImage: 1,
                        title: 1,
                    }
                }
            }
        ];
        const result = await this.model.aggregate(pipeline);
        return result[0];
    }
};
TicketRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], TicketRepository);
export { TicketRepository };
//# sourceMappingURL=ticket-repository.js.map