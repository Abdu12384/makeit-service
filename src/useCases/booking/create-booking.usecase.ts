import { inject, injectable } from "tsyringe";
import { ICreateBookingUseCase } from "../../domain/interface/useCaseInterface/booking/create-booking-usecase.interface";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { CustomError } from "../../domain/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface";
import { NotificationType } from "../../shared/dtos/notification";

@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IPushNotificationService")
    private _pushNotificationService: IPushNotificationService
  ) {}

  async execute(
    serviceId: string,
    date: Date,
    email: string,
    phone: string,
    vendorId: string,
    userId: string
  ): Promise<void> {
    const bookingId = generateUniqueId("booking");

    const bookingsDetails =
      await this._bookingRepository.findExactApprovedBookingByVendorAndDate(
        vendorId,
        date
      );

    const bookedDate = bookingsDetails?.date;

    const existingBooking = await this._bookingRepository.findOne({
      clientId: userId,
      serviceId: serviceId,
      status: { $ne: "Cancelled" },
      date: { $in: [date] },
    });

    if (existingBooking) {
      throw new CustomError(
        "You have already booked this service for this date.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const booking = await this._bookingRepository.save({
      bookingId,
      clientId: userId,
      serviceId,
      email,
      phone,
      vendorId,
      date: [date],
    });

    await this._pushNotificationService.sendNotification(
      vendorId,
      NotificationType.SERVICE_BOOKING,
      `You have received a new booking for ${new Date(date).toDateString()}`,
      "booking",
      "vendor"
    );
  }
}
