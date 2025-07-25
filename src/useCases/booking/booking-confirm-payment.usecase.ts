import { inject, injectable } from "tsyringe";
import { IBookingConfirmPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-confirm-payment-usecase.interface";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface";
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface";
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository";
import { IBookingEntity } from "../../domain/entities/booking.entity";
import { IRedisTokenRepository } from "../../domain/interface/repositoryInterfaces/redis/redis-token-repository.interface";





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
    if (!paymentIntent) throw new Error("Failed to confirm Stripe payment");


    const existingBooking = await this._bookingRepository.findOne({bookingId:booking.bookingId})
      if(!existingBooking){
        throw new Error("Booking not found")
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
      throw new Error("Stripe payment not successful");
    } 
    await this._redisTokenRepository.deleteEventLock(booking.clientId, booking.serviceId);

  }

}


