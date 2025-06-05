import { inject, injectable } from "tsyringe";
import { ICreateBookingUseCase } from "../../domain/interface/useCaseInterface/booking/create-booking-usecase.interface.js";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";






@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase{
    constructor(
        @inject("IBookingRepository") private _bookingRepository: IBookingRepository
    ){}

    async execute(serviceId:string,date:Date,email:string,phone:string,vendorId:string,userId:string):Promise<void>{
        
      const bookingId = generateUniqueId("booking")

      const bookingsDetails = await this._bookingRepository.findExactApprovedBookingByVendorAndDate(vendorId,date)
     
      const bookedDate = bookingsDetails?.date
      console.log("bookeddate",bookedDate)
      if(bookedDate && bookingsDetails.vendorApproval === "Approved"){
        if (Array.isArray(bookedDate) && bookedDate.length > 0) {
          throw new CustomError(
            `${new Date(bookedDate[0]).toDateString()} is already booked. Please select another date.`,
            HTTP_STATUS.BAD_REQUEST
          );
        }
      }

      const booking = await this._bookingRepository.save({
        bookingId,
        clientId: userId,
        serviceId,
        email,
        phone,
        vendorId,
        date,
      })
    }
} 