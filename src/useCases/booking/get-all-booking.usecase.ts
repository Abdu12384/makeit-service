import { inject, injectable } from "tsyringe";
import { IGetAllBookingUseCase } from "../../domain/interface/useCaseInterface/booking/get-all-booking-usecase.interface";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface";
import { IBookingEntity } from "../../domain/entities/booking.entity";

@injectable()
export class GetAllBookingUseCase implements IGetAllBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    status: string,
    role: string,
    userId: string
  ): Promise<{ bookings: IBookingEntity[]; total: number }> {
    const validPageNumber = Math.max(1, pageNumber || 1);
    const validPageSize = Math.max(1, pageSize || 10);
    const skip = (validPageNumber - 1) * validPageSize;
    const filter: Record<string, unknown> = {};

    if (role === "vendor" && userId) {
      filter.vendorId = userId;
    } else if (role === "client" && userId) {
      filter.clientId = userId;
    }

    if (status === "pending") {
      filter.status = "Pending";
    } else if (status === "completed") {
      filter.status = "Completed";
    } else if (status === "rescheduled") {
      filter.status = "Rescheduled";
    } else if (status === "cancelled") {
      filter.status = "Cancelled";
    } else if (status === "confirmed") {
      filter.status = "Confirmed";
    } else if (status === "rejected") {
      filter.vendorApproval = "Rejected";
    } else if (status === "approved") {
      filter.$and = [{ status: "Pending" }, { vendorApproval: "Approved" }];
    }
    const limit = validPageSize;
    const sort = { createdAt: -1 as -1 };
    const { items, total } =
      await this._bookingRepository.findAllWithVendorClient(
        filter,
        skip,
        limit,
        sort
      );
    const response = {
      bookings: items,
      total: Math.ceil(total / validPageSize),
    };
    return response;
  }
}
