import { IBookingEntity } from "../../../entities/booking.entity";

export interface IBookingPaymentUseCase{
    confirmPayment: (paymentIntentId: string,bookingId:string,bookingDetails:IBookingEntity,clientId:string) => Promise<{clientStripeId: string, booking: IBookingEntity}>;
}