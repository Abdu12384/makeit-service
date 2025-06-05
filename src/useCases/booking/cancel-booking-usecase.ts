import { inject, injectable } from "tsyringe"
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface.js"
import { ICancelBookingUseCase } from "../../domain/interface/useCaseInterface/booking/cancel-booking-usecase.interface.js"












@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase{
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository: IBookingRepository
    ){}

    async execute(bookingId:string): Promise<void>{
        const booking = await this._bookingRepository.findOne({bookingId})
        if(!booking){
            throw new Error("Booking not found")
        }
        booking.status = "Cancelled"
        await this._bookingRepository.update({bookingId},booking)
    }
}