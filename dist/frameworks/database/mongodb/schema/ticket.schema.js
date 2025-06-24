"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ticketSchema = new mongoose_1.Schema({
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
        enum: ['used', 'refunded', 'unused', 'partially_refunded']
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
    checkedIn: {
        type: String,
        enum: ['checked_in', 'pending', 'cancelled'],
        default: 'pending'
    },
    checkInHistory: {
        type: [Date],
        default: []
    },
    cancellationHistory: {
        type: [
            {
                count: Number,
                amount: Number,
                date: Date
            }
        ],
        default: []
    }
}, {
    timestamps: true
});
//# sourceMappingURL=ticket.schema.js.map