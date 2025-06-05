import { inject, injectable } from "tsyringe"
import { IUpdateBookingStatusUseCase } from "../../domain/interface/useCaseInterface/booking/update-booking-status-usecase.interface"
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface"
import { IEmailService } from "../../domain/interface/servicesInterface/email.service.interface"








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
        
        if (status === "Approved") {
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