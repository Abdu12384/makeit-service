import { Schema } from "mongoose";
export const ticketSchema = new Schema({
    ticketId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        ref: "client",
        required: true
    },
    vendorId: {
        type: String,
        ref: "vendors",
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        ref: 'event',
        required: true
    },
    ticketCount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "successfull", "failed", "refunded"]
    },
    phone: {
        type: String,
        required: false
    },
    qrCodeLink: {
        type: String,
        required: true
    },
    ticketStatus: {
        type: String,
        enum: ['used', 'refunded', 'unused']
    },
    paymentTransactionId: {
        type: String,
        ref: 'payment',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    checkInHistory: {
        type: [Date],
        default: []
    }
}, {
    timestamps: true
});
//# sourceMappingURL=ticket.schema.js.map