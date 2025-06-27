import { Schema } from "mongoose";
import { ITransactionModel } from "../model/transaction.model";

export const transactionSchema = new Schema<ITransactionModel>({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ["debit", "credit"]
    },
    paymentType: {
        type: String,
        enum: ["refund", "ticketBooking", "top-up", "bookingPayment", "adminCommission","serviceBooking","advancePayment"]
    },
    walletId: {
        type: String,
        ref: 'wallet',
        required: true
    }
}, {
    timestamps: true
})