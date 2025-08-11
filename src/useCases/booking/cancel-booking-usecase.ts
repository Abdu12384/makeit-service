import { inject, injectable } from "tsyringe"
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface"
import { ICancelBookingUseCase } from "../../domain/interface/useCaseInterface/booking/cancel-booking-usecase.interface"
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface"
import { ERROR_MESSAGES, HTTP_STATUS, NotificationType } from "../../shared/constants"
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface"
import { CustomError } from "../../domain/utils/custom.error"










@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase{
    constructor(
        @inject("IBookingRepository")
        private _bookingRepository: IBookingRepository,
        @inject("IPushNotificationService")
        private _pushNotificationService: IPushNotificationService,
        @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository
    ){}

    async execute(bookingId:string): Promise<void>{
        const booking = await this._bookingRepository.findOne({bookingId})
        if(!booking){
            throw new CustomError(ERROR_MESSAGES.BOOKING_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }

        booking.status = "Cancelled"
        await this._bookingRepository.update({bookingId},booking)

        const vendor = await this._vendorRepository.VendorfindOne(booking.vendorId);

        if (!vendor) throw new CustomError(ERROR_MESSAGES.VENDOR_NOT_FOUND,HTTP_STATUS.NOT_FOUND);

        if (!Array.isArray(vendor.bookedDates)) {
            vendor.bookedDates = [];
          }

          const oldIndex = vendor.bookedDates.findIndex(
            (entry) => new Date(entry.date).toDateString() === new Date(booking.date[0]).toDateString()
          );
          
          if (oldIndex !== -1) {
            vendor.bookedDates[oldIndex].count -= 1;
            if (vendor.bookedDates[oldIndex].count <= 0) {
              vendor.bookedDates.splice(oldIndex, 1);
            }
          }
          await this._vendorRepository.vendorSave(vendor)

        

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