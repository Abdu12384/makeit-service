import { inject, injectable } from "tsyringe"
import { IBookingPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-payment-usecase.interface"
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface"
import { IServiceRepository } from "../../domain/interface/repositoryInterfaces/service/service-repository.interface"
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface"
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository"
import { IBookingEntity } from "../../domain/entities/booking.entity"
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper"




@injectable()
export class BookingPaymentUseCase implements IBookingPaymentUseCase{
    constructor(
        @inject("IBookingRepository") private _bookingRepository: IBookingRepository,
        @inject("IServiceRepository") private _serviceRepository: IServiceRepository,
        @inject("IPaymentService") private _paymentService: IPaymentService,
        @inject("IPaymentRepository") private _paymentRepository: IPaymentRepository
    ){}

    async confirmPayment(paymentIntentId:string,bookingId:string,bookingDetails:any,clientId:string):Promise<{clientStripeId:string,booking:IBookingEntity}>{
        let booking = await this._bookingRepository.findOne({bookingId})
        console.log("booking",booking)
        let serviceId = booking?.serviceId || bookingDetails.serviceId;
        const service = await this._serviceRepository.findOne({ serviceId });
        const totalAmount = service?.servicePrice!;
        const advanceAmount = Math.round(totalAmount * 0.3);
        const balanceAmount = totalAmount - advanceAmount;
      
        let amountToPay: number;
      
        if (!booking) {
          // New booking → pay advance
          const newBookingId = generateUniqueId("booking");
          booking = await this._bookingRepository.save({
            bookingId: newBookingId,
            clientId,
            serviceId: bookingDetails.serviceId,
            email: bookingDetails.email,
            phone: bookingDetails.phone,
            vendorId: bookingDetails.vendorId,
            date: [bookingDetails.date],
            status: "Pending",
            paymentStatus: "AdvancePaid",
            vendorApproval: "Pending",
            balanceAmount: balanceAmount,
          });
          amountToPay = advanceAmount;
        } else {
          if (booking.paymentStatus === "Successfull") {
            throw new Error("This booking is already fully paid.");
          }
      
          if (booking.paymentStatus === "Pending") {
            // First advance payment for existing booking
            amountToPay = advanceAmount;
      
            await this._bookingRepository.updateOne(
              { bookingId: booking.bookingId },
              {
                $set: {
                  paymentStatus: "AdvancePaid",
                  balanceAmount: balanceAmount,
                  status: "Confirmed",
                },
              }
            );
          } else if (booking.paymentStatus === "AdvancePaid") {
            // Balance payment
            if (!booking.balanceAmount || booking.balanceAmount <= 0) {
              throw new Error("No balance amount available to pay.");
            }
      
            amountToPay = booking.balanceAmount;
      
            await this._bookingRepository.updateOne(
              { bookingId: booking.bookingId },
              {
                $set: {
                  paymentStatus: "Successfull",
                  balanceAmount: 0,
                },
              }
            );
          } else {
            throw new Error("Invalid payment status.");
          }
        }
      
        console.log("amountToPay", amountToPay);
      
        const clientStripeId = await this._paymentService.createPaymentIntent(
          amountToPay,
          "service",
          { bookingId }
        );
      
        const payment = await this._paymentRepository.save({
          clientId: booking.clientId,
          receiverId: service?.vendorId,
          bookingId: booking.bookingId,
          amount: amountToPay,
          currency: "INR",
          purpose: "serviceBooking",
          status: "pending",
          paymentId: paymentIntentId,
        });
      
        console.log("payment", payment);
      
        return { booking, clientStripeId };
    }
}

