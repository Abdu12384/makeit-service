import { inject, injectable } from "tsyringe";
import { IBookingConfirmPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-confirm-payment-usecase.interface";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface";
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface";
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository";





@injectable()
export class ConfirmPaymentUseCase implements IBookingConfirmPaymentUseCase {
  constructor(
    @inject("IBookingRepository") private _bookingRepository: IBookingRepository,
    @inject("IPaymentService") private _stripeService: IPaymentService,
    @inject("IPaymentRepository") private _paymentRepository: IPaymentRepository
  ) {}

  async confirmPayment(paymentIntentId: string, booking: string): Promise<void> {

    const paymentIntent = await this._stripeService.confirmPayment(paymentIntentId);
    if (!paymentIntent) throw new Error("Failed to confirm Stripe payment");

    

    console.log("paymentIntent",paymentIntent)
    if (paymentIntent.status === "succeeded") {
      await this._bookingRepository.update({ bookingId:booking}, {paymentStatus: "Successfull"});
      await this._paymentRepository.update({bookingId:booking}, {status: "success"});
    } else {
      await this._bookingRepository.update({bookingId:booking}, {paymentStatus: "Failed"});
      await this._paymentRepository.update({bookingId:booking}, {status: "failed"});
      throw new Error("Stripe payment not successful");
    } 
  }
}


