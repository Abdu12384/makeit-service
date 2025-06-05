export interface IBookingPaymentUseCase{
    confirmPayment: (paymentIntentId: string,bookingId:string) => Promise<{clientStripeId: string, booking: any}>;
}