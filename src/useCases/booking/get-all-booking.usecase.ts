import { inject, injectable } from "tsyringe";
import { IGetAllBookingUseCase } from "../../domain/interface/useCaseInterface/booking/get-all-booking-usecase.interface";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface";
import { IBookingEntity } from "../../domain/entities/booking.entity";





@injectable()
export class GetAllBookingUseCase implements IGetAllBookingUseCase{
    constructor(
      @inject("IBookingRepository") 
      private _bookingRepository: IBookingRepository
    ){}

    async execute(pageNumber:number,pageSize:number,role:string,userId:string): Promise<{bookings:IBookingEntity[],total:number}>{

          const validPageNumber = Math.max(1, pageNumber || 1);
          const validPageSize = Math.max(1, pageSize || 10);
          const skip = (validPageNumber - 1) * validPageSize;
          const filter: Record<string,any> = {};

          if (role === "vendor"&& userId ) {
            filter.vendorId = userId;
          }else if(role === "client" && userId){
            filter.clientId = userId
          }
          const limit = validPageSize;

          const sort = { createdAt: -1 as -1 };  

          const {items , total} = await this._bookingRepository.findAllWithVendorClient(filter,skip,limit,sort)
          const response = {
            bookings: items,
            total: Math.ceil(total / validPageSize)
          }
          return response
    }
}        