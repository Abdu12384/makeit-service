import Stripe from "stripe";
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface";
import { injectable } from "tsyringe";




@injectable()
export class PaymentService implements IPaymentService {
    private stripe: Stripe
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY||"", {
            apiVersion: "2025-04-30.basil"
        })
    }
    async createPaymentIntent(amount: number, purpose: "ticket" | "service", metadata: Record<string, any>): Promise<string> {


        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: 'inr',
                metadata: {
                    purpose,
                    ticket: JSON.stringify(metadata)
                }
            })
            if (!paymentIntent.client_secret) {
                throw new Error("Payment intent creation failed: Missing client_secret.");
            }
            return paymentIntent.client_secret
        } catch (error) {
            console.error("[StripePaymentService] Failed to create payment intent:", error);
            throw new Error("Stripe payment intent creation failed.");
        }

    }
    async confirmPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)
            // if (paymentIntent.status !== 'succeeded') {
            //     throw new Error('Payment not successful');
            // }
            return paymentIntent;
        } catch (error) {
            console.error("[StripePaymentService] Error confirming payment:", error);
            throw new Error("Failed to confirm payment");
        }
    }
}