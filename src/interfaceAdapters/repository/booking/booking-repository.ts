import { injectable } from "tsyringe";
import { IBookingRepository } from "../../../domain/interface/repositoryInterfaces/booking/booking-repository.interface.js";
import { BookingModel, IBookingModel } from "../../../frameworks/database/mongodb/model/booking.model.js";
import { BaseRepository } from "../base.repository.js";
import { FilterType, SortType } from "../../../shared/constants.js";


@injectable()
export class BookingRepository  extends BaseRepository<IBookingModel> implements IBookingRepository{
    constructor(){
        super(BookingModel)
    }

    async findAllWithVendorClient(filter: FilterType, skip: number, limit: number, sort: SortType): Promise<{ items: any[], total: number }> {

      const pipeline: any[] = [
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
      ]

      const result = await BookingModel.aggregate(pipeline);
      const items = result[0]?.data || [];
      const total = result[0]?.count[0]?.total || 0;

      return {
          items,
          total
      }
  }

    async findExactApprovedBookingByVendorAndDate(vendorId: string, date: Date): Promise<IBookingModel | null> {
      const parsedDate = new Date(date); // Convert from string
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
  
    return await this.model.findOne({
      vendorId,
      vendorApproval: "Approved",
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  }


  async checkVendorBookingConflict(vendorId: string, bookingDate: Date, currentBookingId: string): Promise<boolean> {
    const parsedDate = new Date(bookingDate);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
  
    const conflict = await this.model.findOne({
      vendorId,
      vendorApproval: "Approved",
      date: { $gte: startOfDay, $lte: endOfDay },
      bookingId: { $ne: currentBookingId }  
    });
  
    return !!conflict;
  }
  

}