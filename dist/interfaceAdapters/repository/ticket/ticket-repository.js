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
exports.TicketRepository = void 0;
const tsyringe_1 = require("tsyringe");
const ticket_model_1 = require("../../../frameworks/database/mongodb/model/ticket.model");
const base_repository_1 = require("../base.repository");
let TicketRepository = class TicketRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(ticket_model_1.ticketModel);
    }
    getAllTicketsById(filter, skip, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const mongoSort = {};
            for (const key in sort) {
                mongoSort[key] = sort[key] === "asc" ? 1 : -1;
            }
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
                { $match: filter },
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
    findOneWithPopulate(filter) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield this.model.aggregate(pipeline);
            return result[0];
        });
    }
    findAllWithClientDetails(eventId_1) {
        return __awaiter(this, arguments, void 0, function* (eventId, skip = 0, limit = 10) {
            const matchStage = { $match: { eventId: eventId } };
            const aggregationPipeline = [
                matchStage,
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
                        checkedIn: 1,
                        email: 1,
                        phone: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        client: {
                            _id: 1,
                            userId: 1,
                            name: 1,
                            email: 1,
                            phone: 1,
                            profileImage: 1
                        }
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit }
            ];
            const [items, countResult] = yield Promise.all([
                this.model.aggregate(aggregationPipeline),
                this.model.countDocuments({ eventId })
            ]);
            return {
                items,
                total: countResult
            };
        });
    }
};
exports.TicketRepository = TicketRepository;
exports.TicketRepository = TicketRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], TicketRepository);
//# sourceMappingURL=ticket-repository.js.map