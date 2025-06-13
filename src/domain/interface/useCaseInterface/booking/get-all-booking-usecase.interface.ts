import { IBookingEntity } from "../../../entities/booking.entity";

export interface IGetAllBookingUseCase{
    execute(pageNumber:number,pageSize:number,role:string,userId:string): Promise<{bookings:IBookingEntity[],total:number}>
}