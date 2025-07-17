import { IBookingEntity } from "../../../entities/booking.entity";

export interface IGetAllBookingUseCase{
    execute(pageNumber:number,pageSize:number,status:string,role:string,userId:string): Promise<{bookings:IBookingEntity[],total:number}>
}