import { IBookingEntity } from "../../../entities/booking.entity";
import { UpdateQuery } from "mongoose";
import { IBaseRepository } from "../base-repository.interface";
import { FilterType, SortType } from "../../../../shared/constants";
import { IBookingModel } from "../../../../frameworks/database/mongodb/model/booking.model";



export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
    findAllWithVendorClient(filter: FilterType, skip: number, limit: number,sort: SortType): Promise<{ items: IBookingEntity[], total: number }>;
    findExactApprovedBookingByVendorAndDate(vendorId: string, date: Date): Promise<IBookingEntity | null>;
    checkVendorBookingConflict(vendorId: string, bookingDate: Date, currentBookingId: string): Promise<boolean>;
    updateOne(filter: FilterType, updateData: UpdateQuery<IBookingModel>): Promise<void>;
}