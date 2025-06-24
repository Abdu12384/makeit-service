import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface.js";
import { IRescheduleBookingUseCase } from "../../domain/interface/useCaseInterface/booking/resudule-booking-usecase.interface.js";
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface.js";
import { NotificationType } from "../../shared/dtos/notification.js";
















@injectable()
export class RescheduleBookingUseCase implements IRescheduleBookingUseCase {
    
  constructor(
    @inject("IBookingRepository") 
    private _bookingRepository: IBookingRepository,
    @inject("IPushNotificationService")
    private _pushNotificationService: IPushNotificationService
){}

async execute(
    bookingId: string,
    selectedDate: string,
    rescheduleReason: string,
): Promise<void> {
  const booking = await this._bookingRepository.findOne({ bookingId });

  if (!booking) {
    throw new Error("Booking not found.");
  }


  await this._bookingRepository.updateOne(
    { bookingId },
    {
      $set: {
        date: [selectedDate], 
        status: "Rescheduled", 
        rescheduleReason,
      },
    }
  );
 
   
   this._pushNotificationService.sendNotification(
    booking.clientId,
    NotificationType.RESCHEDULE_SERVICE_BOOKING,
    `Your booking has been rescheduled to ${selectedDate}.`,
    "booking",
    "client"
  );

 }
}
