import { Schema } from 'mongoose'
import { IBookingModel } from '../model/booking.model'
export const bookingSchema = new Schema<IBookingModel>({
    bookingId:{
        type:String,
        required:true
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
        enum: ["Pending", "Failed", "Successfull", "Refunded",'AdvancePaid','Confirmed'],
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
        enum: ['Pending', 'Rejected', 'Completed','Cancelled','Confirmed',"vendorCancelled","Rescheduled"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isComplete:{
        type:Boolean,
        default:false
    },
    balanceAmount: {
        type: Number,
        required: false,
        default: 0,
      },
      rescheduleReason:{
        type:String,
        required:false
      },
      rescheduleDate:{
        type:Date,
        required:false
      },
      rescheduleStatus:{
        type: String,
        enum:["Pending","Approved","Rejected","Requested"],
        default:"Pending"
      },
      cancellationReason:{
        type:String,
        required:false
      },
}, {
    timestamps: true
})