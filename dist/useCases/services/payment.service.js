"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const tsyringe_1 = require("tsyringe");
let PaymentService = class PaymentService {
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || "", {
            apiVersion: "2025-04-30.basil"
        });
    }
    createPaymentIntent(amount, purpose, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(metadata);
            try {
                const paymentIntent = yield this.stripe.paymentIntents.create({
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
        });
    }
    confirmPayment(paymentIntentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.paymentIntents.retrieve(paymentIntentId);
                // if (paymentIntent.status !== 'succeeded') {
                //     throw new Error('Payment not successful');
                // }
                return paymentIntent;
            }
            catch (error) {
                console.error("[StripePaymentService] Error confirming payment:", error);
                throw new Error("Failed to confirm payment");
            }
        });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], PaymentService);
//# sourceMappingURL=payment.service.js.map