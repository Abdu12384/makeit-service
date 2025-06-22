import { BaseRepository } from "../base.repository.js";
import { eventModel, IEventModel } from "../../../frameworks/database/mongodb/model/event.model.js";
import { injectable } from "tsyringe";
import { IEventRepository } from "../../../domain/interface/repositoryInterfaces/event/event-repository.interface.js";
import { IVendorEntity } from "../../../domain/entities/vendor.entity.js";
import { IClientEntity } from "../../../domain/entities/client.entity.js";
import { IEventEntity } from "../../../domain/entities/event.entity.js";


@injectable()
export class EventRepository extends BaseRepository<IEventModel> implements IEventRepository {
   constructor(){
      super(eventModel)
   }

   async findWithAggregation(eventId: string): Promise<IVendorEntity|IEventEntity> {
    const result = await this.model.aggregate([
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
          attendees:1,
          date:1,
          location:1,
          pricePerTicket:1,
          totalTicket:1,
          ticketPurchased:1,
          status:1,
          startTime:1,
          endTime:1,
          venueName:1,
          category:1,
          posterImage:1,
          title:1,
          attendeesCount:1,
          maxTicketsPerUser:1,
          isActive:1,
          description:1,
          vendorDetails: {
            userId: 1,
            name: 1,
            email: 1,
            phone: 1,
            profileImage: 1
          }
        }
      }
    ])
  
    return result[0] || null;
  }
  async findAttendeesById(eventId: string): Promise<IClientEntity[]> {
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
    ])
  
    return result[0]?.attendees || []
  }


  
}
    