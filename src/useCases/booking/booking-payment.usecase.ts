import { inject, injectable } from "tsyringe"
import { IBookingPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-payment-usecase.interface"
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface"
import { IServiceRepository } from "../../domain/interface/repositoryInterfaces/service/service-repository.interface"
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface"
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository"





@injectable()
export class BookingPaymentUseCase implements IBookingPaymentUseCase{
    constructor(
        @inject("IBookingRepository") private _bookingRepository: IBookingRepository,
        @inject("IServiceRepository") private _serviceRepository: IServiceRepository,
        @inject("IPaymentService") private _paymentService: IPaymentService,
        @inject("IPaymentRepository") private _paymentRepository: IPaymentRepository
    ){}

    async confirmPayment(paymentIntentId:string,bookingId:string):Promise<{clientStripeId:string,booking:any}>{
        const booking = await this._bookingRepository.findOne({bookingId})
        console.log("booking",booking)
        if(!booking) throw new Error("Booking not found")
        if (booking.status != 'Completed') throw new Error('This Booking is not completed')
       if (booking.paymentStatus == "Successfull") throw new Error('This booking is Already paid')

        const service = await this._serviceRepository.findOne({serviceId: booking.serviceId})
        
        const totalAmount = booking.date.length * service.servicePrice
        
                const clientStripeId = await this._paymentService.createPaymentIntent(
                  totalAmount,
                  "service",
                  {bookingId}
                )

        const payment = await this._paymentRepository.save({
            clientId: booking.clientId,
            receiverId: service?.vendorId,
            bookingId: booking.bookingId,
            amount: totalAmount,
            currency: "INR",
            purpose: "serviceBooking",
            status: "pending",
            paymentId: paymentIntentId
        })  
        console.log("payment",payment)
 
        return {booking,clientStripeId}
    }
}

