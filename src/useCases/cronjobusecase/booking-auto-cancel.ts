import { inject, injectable } from "tsyringe";
import { IBookingAutoCancelUseCase } from "../../domain/interface/useCaseInterface/cronjob/booking-auto-cancel-usecase.interface";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface";







@injectable()
export class BookingAutoCancelUseCase implements IBookingAutoCancelUseCase{
    
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ){}
    
    async execute(): Promise<void> {
      const bookings = await this._bookingRepository.find({
        where:{
          status:"pending",
          createdAt:{
            $lt: new Date(new Date().setDate(new Date().getDate() - 1))
          }
        }
      })

      if(bookings.length === 0) return
      for(const booking of bookings){
        await this._bookingRepository.updateOne({bookingId:booking.bookingId},{
          status:"cancelled"
        })
      }
    }
}