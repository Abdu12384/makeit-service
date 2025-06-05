import { IBookingEntity } from "../../../entities/booking.entity";
import { IBaseRepository } from "../base-repository.interface";


export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
    findAllWithVendorClient(filter: any, skip: number, limit: number,sort: any): Promise<{ items: any[], total: number }>;
    findExactApprovedBookingByVendorAndDate(vendorId: string, date: Date): Promise<IBookingEntity | null>;
}