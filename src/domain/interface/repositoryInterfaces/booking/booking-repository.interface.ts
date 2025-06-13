import { IBookingEntity } from "../../../entities/booking.entity";
import { IBaseRepository } from "../base-repository.interface";
import { FilterType, SortType } from "../../../../shared/constants";



export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
    findAllWithVendorClient(filter: FilterType, skip: number, limit: number,sort: SortType): Promise<{ items: IBookingEntity[], total: number }>;
    findExactApprovedBookingByVendorAndDate(vendorId: string, date: Date): Promise<IBookingEntity | null>;
}