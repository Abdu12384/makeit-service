var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import Stripe from "stripe";
import { injectable } from "tsyringe";
let PaymentService = class PaymentService {
    stripe;
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
            apiVersion: "2025-04-30.basil"
        });
    }
    async createPaymentIntent(amount, purpose, metadata) {
        console.log(metadata);
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: 'inr',
                metadata: {
                    purpose,
                    ticket: JSON.stringify(metadata)
                }
            });
            if (!paymentIntent.client_secret) {
                throw new Error("Payment intent creation failed: Missing client_secret.");
            }
            return paymentIntent.client_secret;
        }
        catch (error) {
            console.error("[StripePaymentService] Failed to create payment intent:", error);
            throw new Error("Stripe payment intent creation failed.");
        }
    }
    async confirmPayment(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            // if (paymentIntent.status !== 'succeeded') {
            //     throw new Error('Payment not successful');
            // }
            return paymentIntent;
        }
        catch (error) {
            console.error("[StripePaymentService] Error confirming payment:", error);
            throw new Error("Failed to confirm payment");
        }
    }
};
PaymentService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], PaymentService);
export { PaymentService };
//# sourceMappingURL=payment.service.js.map