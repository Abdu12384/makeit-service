export interface IBookingConfirmPaymentUseCase{
    confirmPayment(paymentIntentId:string,bookingId:string):Promise<void>
}