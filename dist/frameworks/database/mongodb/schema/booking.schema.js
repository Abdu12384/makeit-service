"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.bookingSchema = new mongoose_1.Schema({
    bookingId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true,
    },
    date: [{
            type: Date,
            required: true
        }],
    paymentStatus: {
        type: String,
        enum: ["Pending", "Failed", "Successfull", "Refunded", 'AdvancePaid', 'Confirmed', 'Rescheduled'],
        default: "Pending"
    },
    serviceId: {
        type: String,
        required: true,
    },
    vendorApproval: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: 'Pending'
    },
    vendorId: {
        type: String,
        required: true,
        ref: 'vendors'
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    rejectionReason: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Rejected', 'Completed', 'Cancelled', 'Confirmed'],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    balanceAmount: {
        type: Number,
        required: false,
        default: 0,
    },
    rescheduleReason: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
//# sourceMappingURL=booking.schema.js.map