import { inject, injectable } from "tsyringe"
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface"
import { ICancelBookingUseCase } from "../../domain/interface/useCaseInterface/booking/cancel-booking-usecase.interface"
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface"
import { NotificationType } from "../../shared/dtos/notification"












@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase{
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository: IBookingRepository,
        @inject("IPushNotificationService")
        private _pushNotificationService: IPushNotificationService
    ){}

    async execute(bookingId:string): Promise<void>{
        const booking = await this._bookingRepository.findOne({bookingId})
        if(!booking){
            throw new Error("Booking not found")
        }
        booking.status = "Cancelled"
        await this._bookingRepository.update({bookingId},booking)

        await this._pushNotificationService.sendNotification(
            booking.clientId,
            NotificationType.CANCEL_SERVICE_BOOKING,
            `Your booking for ${new Date(booking.date[0]).toDateString()} has been cancelled`,
            "booking",
            "client"
          );
          await this._pushNotificationService.sendNotification(
            booking.vendorId,
            NotificationType.CANCEL_SERVICE_BOOKING,
            `Your booking for ${new Date(booking.date[0]).toDateString()} has been cancelled`,
            "booking",
            "vendor"
          );
    }
}