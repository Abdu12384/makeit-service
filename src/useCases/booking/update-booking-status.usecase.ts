import { inject, injectable } from "tsyringe"
import { IUpdateBookingStatusUseCase } from "../../domain/interface/useCaseInterface/booking/update-booking-status-usecase.interface.js"
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface.js"
import { IEmailService } from "../../domain/interface/servicesInterface/email.service.interface.js"
import { CustomError } from "../../domain/utils/custom.error.js"
import { HTTP_STATUS } from "../../shared/constants.js"








@injectable()
export class UpdateBookingStatusUseCase implements IUpdateBookingStatusUseCase{
    constructor(  
        @inject("IBookingRepository") 
        private _bookingRepository: IBookingRepository,
        @inject("IEmailService")
        private _mailService: IEmailService
    ){}

    async execute(bookingId:string,status:string,reason?:string):Promise<void>{
        const booking = await this._bookingRepository.findOne({bookingId})
        if(!booking){
          throw new Error("Booking not found")
        }

        if(status === "Cancelled"){
          booking.status = "Cancelled"
          this._mailService.sendCustomEmail(
            booking.email,
            "Booking Cancelled",
            `Your booking has been cancelled. Reason: ${reason || "No reason provided."}`
          )
        }
        
        if (status === "Approved") {

          const conflict = await this._bookingRepository.checkVendorBookingConflict(
            booking.vendorId,
            booking.date[0] as Date,
            booking.bookingId as string,
          );
        
          if (conflict) throw new CustomError("You already have an approved booking on this date.",HTTP_STATUS.BAD_REQUEST);

          booking.vendorApproval = "Approved";
          booking.status = "Pending";
        } else if (status === "Rejected") {
          booking.vendorApproval = "Rejected";
          booking.status = "Rejected";
          booking.rejectionReason = reason;
        
          await this._mailService.sendCustomEmail(
            booking.email,
            "Booking Rejected",
            `Your booking has been rejected. Reason: ${reason || "No reason provided."}`
          );
        } else if (status === "Completed") {
          const today = new Date();
          const bookingDate = new Date(booking.date[0]);  
        
          if (bookingDate > today) {
            throw new CustomError("You can only mark this booking as completed after the booking date.", HTTP_STATUS.BAD_REQUEST);
          }
        
          booking.isComplete = true;
          booking.status = "Completed";
        }

        console.log("booking",booking)
        await this._bookingRepository.update(
          {bookingId},
          booking
        )
    }
}