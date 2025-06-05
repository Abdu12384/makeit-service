import { Schema } from "mongoose";
export const transactionSchema = new Schema({
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
        enum: ["refund", "ticketBooking", "top-up", "bookingPayment", "adminCommission"]
    },
    walletId: {
        type: String,
        ref: 'wallet',
        required: true
    }
}, {
    timestamps: true
});
//# sourceMappingURL=transaction.schema.js.map