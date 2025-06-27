import { inject, injectable } from "tsyringe";
import { IGetVendorBookedDatesUseCase } from "../../domain/interface/useCaseInterface/booking/get-vendor-booked-dates-usecase.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";











@injectable()
export class GetVendorBookedDatesUseCase implements IGetVendorBookedDatesUseCase{
    constructor(
      @inject("IVendorRepository")
      private _vendorRepository: IVendorRepository,

    ){}
  


  async execute(userId:string):Promise<{dates:{date:string; count:number}[]}>{
    
    const vendor = await this._vendorRepository.BookingDates(userId)
    if(!vendor){
      throw new CustomError(
        ERROR_MESSAGES.REQUEST_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }
    const dates = (vendor.bookedDates || []).map((item) => ({
      date: new Date(item.date).toISOString().split("T")[0],
      count: item.count,
    }));

    return {dates}
  }
}
