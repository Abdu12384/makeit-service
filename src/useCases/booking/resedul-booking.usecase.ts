import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface";
import { IRescheduleBookingUseCase } from "../../domain/interface/useCaseInterface/booking/resudule-booking-usecase.interface";
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface";
import { NotificationType } from "../../shared/constants";
import { CustomError } from "../../domain/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";





@injectable()
export class RescheduleBookingUseCase implements IRescheduleBookingUseCase {
    
  constructor(
    @inject("IBookingRepository") 
    private _bookingRepository: IBookingRepository,
    @inject("IPushNotificationService")
    private _pushNotificationService: IPushNotificationService,
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
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

      const existingDate = new Date(booking.date[0]).toDateString();
    const newRequestedDate = new Date(selectedDate).toDateString();

    if (existingDate === newRequestedDate) {
      throw new CustomError("Selected date is the same as the current booking date.",HTTP_STATUS.BAD_REQUEST);
    }

  await this._bookingRepository.updateOne(
    { bookingId },
    {
      $set: {
        rescheduleDate:selectedDate,
        rescheduleReason,
        rescheduleStatus:"Requested"
      },
    }
  );
 
   this._pushNotificationService.sendNotification(
    booking.clientId,
    "booking",
    `Your booking has a new reschedule request from the vendor for ${selectedDate}.`,
    NotificationType.RESCHEDULE_SERVICE_BOOKING,
    "client"
  );
 }


 async approveOrRejectRescheduleBooking(bookingId: string,status:string): Promise<void> {
    const booking = await this._bookingRepository.findOne({ bookingId });

    if (!booking) {
      throw new Error("Booking not found.");
    }

    if(status === "Approved"){

      const oldDate = new Date(booking.date[0]);  
      const newDate = new Date(booking.rescheduleDate!); 


      const vendor = await this._vendorRepository.VendorfindOne(booking.vendorId);
      if (!vendor) {
        throw new Error("Vendor not found.");
      }

      if (!Array.isArray(vendor.bookedDates)) {
        vendor.bookedDates = [];
      }

      const oldIndex = vendor.bookedDates.findIndex(
        (entry) => new Date(entry.date).toDateString() === oldDate.toDateString()
      );

      if (oldIndex !== -1) {
        vendor.bookedDates[oldIndex].count -= 1;
        if (vendor.bookedDates[oldIndex].count <= 0) {
          vendor.bookedDates.splice(oldIndex, 1);
        }
      }

      const newIndex = vendor.bookedDates.findIndex(
        (entry) => new Date(entry.date).toDateString() === newDate.toDateString()
      );
      if (newIndex !== -1) {
        vendor.bookedDates[newIndex].count += 1;
      } else {
        vendor.bookedDates.push({ date: newDate, count: 1 });
      }

      await this._vendorRepository.vendorSave(vendor)

      await this._bookingRepository.updateOne(
        { bookingId },
        {
          $set: {
            status: "Rescheduled",
            date: [booking.rescheduleDate],
            rescheduleStatus:"Approved"
          },
        }
      );

      this._pushNotificationService.sendNotification(
        booking.clientId,
        "booking",
        `Your booking has been successfully rescheduled to ${new Date(booking.rescheduleDate!).toDateString()}.`,
        NotificationType.RESCHEDULE_SERVICE_BOOKING,
        "client"
      );

      this._pushNotificationService.sendNotification(
        booking.vendorId,
        "booking",
        `The client has accepted your reschedule request. New date: ${new Date(booking.rescheduleDate!).toDateString()}.`,
        NotificationType.RESCHEDULE_SERVICE_BOOKING,
        "vendor"
      );
    }

    if(status === "Rejected"){
      await this._bookingRepository.updateOne(
        { bookingId },
        {
          $set: {
            status: "Pending",
            rescheduleStatus:"Rejected"
          },
        }
      );

      const vendor = await this._vendorRepository.VendorfindOne(booking.vendorId);
      if (!vendor) {
        throw new Error("Vendor not found.");
      }

      if (!Array.isArray(vendor.bookedDates)) {
        vendor.bookedDates = [];
      }

      const oldIndex = vendor.bookedDates.findIndex(
        (entry) => new Date(entry.date).toDateString() === new Date(booking.rescheduleDate!).toDateString()
      );
      if (oldIndex !== -1) {
        vendor.bookedDates[oldIndex].count -= 1;
        if (vendor.bookedDates[oldIndex].count <= 0) {
          vendor.bookedDates.splice(oldIndex, 1);
        }
      }
      await this._vendorRepository.vendorSave(vendor)

      this._pushNotificationService.sendNotification(
        booking.clientId,
        "booking",
        `You have rejected the vendor's request to reschedule the booking.`,
        NotificationType.RESCHEDULE_SERVICE_BOOKING,
        "client"
      );

      this._pushNotificationService.sendNotification(
        booking.vendorId,
        "booking",
        `Client has rejected your request to reschedule the booking.`,
        NotificationType.RESCHEDULE_SERVICE_BOOKING,
        "vendor"
      );
    }
  }

}