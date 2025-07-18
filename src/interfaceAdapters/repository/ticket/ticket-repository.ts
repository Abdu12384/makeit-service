import { injectable } from "tsyringe";
import { ticketModel } from "../../../frameworks/database/mongodb/model/ticket.model";
import { BaseRepository } from "../base.repository";
import { ITicketModel } from "../../../frameworks/database/mongodb/model/ticket.model";
import { ITicketRepository } from "../../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";
import { FilterType, SortType } from "../../../shared/constants";
import { IClientEntity } from "../../../domain/entities/client.entity";
import { PipelineStage } from "mongoose";



@injectable()
export class TicketRepository extends BaseRepository<ITicketModel> implements ITicketRepository {
    constructor() {
        super(ticketModel)
    }

    async getAllTicketsById(filter: FilterType, skip: number, limit: number, sort: SortType): Promise<{ items: ITicketModel[], total: number }> {
        const mongoSort: Record<string, 1 | -1> = {};
        for (const key in sort) {
          mongoSort[key] = sort[key] === "asc" ? 1 : -1;
        }
    
        const pipeline: any[] = [
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
            { $match: filter },
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

    async findOneWithPopulate(filter:FilterType){
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

async findAllWithClientDetails(eventId: string, skip = 0, limit = 10): Promise<{ items: IClientEntity[], total: number }> {
  const matchStage = { $match: { eventId: eventId } };

  const aggregationPipeline:PipelineStage[] = [
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

  const [items, countResult] = await Promise.all([
    this.model.aggregate(aggregationPipeline),
    this.model.countDocuments({ eventId })
  ]);

  return {
    items,
    total: countResult
  };
}

}
