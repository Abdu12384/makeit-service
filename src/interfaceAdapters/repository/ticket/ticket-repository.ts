import { injectable } from "tsyringe";
import { ticketModel } from "../../../frameworks/database/mongodb/model/ticket.model.js";
import { BaseRepository } from "../base.repository.js";
import { ITicketModel } from "../../../frameworks/database/mongodb/model/ticket.model.js";
import { ITicketRepository } from "../../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface.js";



@injectable()
export class TicketRepository extends BaseRepository<ITicketModel> implements ITicketRepository {
    constructor() {
        super(ticketModel)
    }

    async getAllTicketsById(userId: string, skip: number, limit: number, sort: any): Promise<{ items: ITicketModel[], total: number }> {
        const pipeline: any[] = [
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
                    createdAt:1,
                    updatedAt:1,
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
        ]

        const countPipeline = [
            { $match: { clientId: userId } },
            { $count: "total" }
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

    async findOneWithPopulate(filter:any){
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
                    createdAt:1,
                    updatedAt:1,
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
        ]
        const result = await this.model.aggregate(pipeline)
        return result[0]
    }
}
