import { IBookingEntity } from "../../../entities/booking.entity";

export interface IBookingConfirmPaymentUseCase{
    confirmPayment(paymentIntentId:string,booking:IBookingEntity):Promise<void>
}