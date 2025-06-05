import { Schema } from "mongoose";
import { IPaymentModel } from "../model/payment.model";

export const paymentSchema = new Schema<IPaymentModel>({
    amount: {
        type: Number,
        required: true
    },
    bookingId: {
        type:String,
        ref: 'bookings'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    currency: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['ticketBooking', 'serviceBooking']
    },
    receiverId: {
        type: String,
        ref: 'vendors'
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed']
    },
    ticketId: {
        type: String,
        required: false
    },
    clientId: {
        type:String,
        ref: 'client',
        required: true
    },
})