import { Schema } from "mongoose";
import { IEventModel } from "../model/event.model";

export const eventSchema = new Schema<IEventModel>({
   eventId:{
     type:String,
     required:false
   },
    address: {
        type: String,
        required: false
    },
    attendees: [{
        type: String,
    }],
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    date: [{
        type: Date,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    hostedBy: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    posterImage: [{
        type: String,
        required: true
    }],
    pricePerTicket: {
        type: Number,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["upcoming", "completed", "cancelled"]
    },
    maxTicketsPerUser: {
        type: Number,
        required: true
    },
    ticketPurchased: {
        type: Number,
        // required: true
    },
    title: {
        type: String,
        required: true
    },
    totalTicket: {
        type: Number,
        required: true
    },
    venueName: {
        type: String,
        required: false
    },
    attendeesCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }

})

eventSchema.index({ location: '2dsphere' });
