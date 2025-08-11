import { inject, injectable } from "tsyringe";
import { IBookingConfirmPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-confirm-payment-usecase.interface";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface";
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface";
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository";
import { IBookingEntity } from "../../domain/entities/booking.entity";
import { IRedisTokenRepository } from "../../domain/interface/repositoryInterfaces/redis/redis-token-repository.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";





@injectable()
export class ConfirmPaymentUseCase implements IBookingConfirmPaymentUseCase {
  constructor(
    @inject("IBookingRepository") private _bookingRepository: IBookingRepository,
    @inject("IPaymentService") private _stripeService: IPaymentService,
    @inject("IPaymentRepository") private _paymentRepository: IPaymentRepository,
    @inject("IRedisTokenRepository") private _redisTokenRepository: IRedisTokenRepository
  ) {}

  async confirmPayment(paymentIntentId: string, booking: IBookingEntity): Promise<void> {


    const paymentIntent = await this._stripeService.confirmPayment(paymentIntentId);
    if (!paymentIntent) throw new CustomError(ERROR_MESSAGES.STRIPE_PAYMENT_FAILED,HTTP_STATUS.BAD_REQUEST);


    const existingBooking = await this._bookingRepository.findOne({bookingId:booking.bookingId})
      if(!existingBooking){
        throw new CustomError(ERROR_MESSAGES.BOOKING_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
      }

    const paidAmount = paymentIntent.amount / 100;

    const balanceAmount = existingBooking.balanceAmount ?? 0;


    if (paymentIntent.status === "succeeded") {
            if (balanceAmount > 0 && paidAmount >= balanceAmount) {
              await this._bookingRepository.update(
                { bookingId: booking.bookingId },
                { paymentStatus: "Successfull", balanceAmount: 0 }
              );
            } else {
              const newBalance = existingBooking?.balanceAmount 

              await this._bookingRepository.update(
                { bookingId: booking.bookingId },
                { balanceAmount: newBalance! > 0 ? newBalance : 0 }
              );
            }
       await this._paymentRepository.update(
          { bookingId: booking.bookingId },
          { status: "success" }
        );

    } else {
      await this._paymentRepository.update(
        { bookingId: booking.bookingId },
        { status: "failed" }
      );
      throw new CustomError(ERROR_MESSAGES.STRIPE_PAYMENT_FAILED,HTTP_STATUS.BAD_REQUEST);
    } 
    await this._redisTokenRepository.deleteEventLock(booking.clientId, booking.serviceId);

  }

}


