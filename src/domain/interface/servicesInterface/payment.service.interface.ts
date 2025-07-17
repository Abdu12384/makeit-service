import Stripe from "stripe";


export interface IPaymentService {
  createPaymentIntent(
    amount: number,
    purpose: 'ticket' | 'service',
    metadata: Record<string, any>
  ): Promise<string>;

  confirmPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
}