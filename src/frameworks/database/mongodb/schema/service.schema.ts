import { Schema } from "mongoose";
import { IServiceModel } from "../model/service.model";
export const serviceSchema = new Schema<IServiceModel>({
    additionalHourFee: {
        type: Number,
        required: true
    },
    cancellationPolicy: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        // required: true
    },
    serviceId: {
        type: String,
        // required: true
    },
    serviceDescription: {
        type: String,
        required: true
    },
    serviceDuration: {
        type: String,
        required: true
    },
    servicePrice: {
        type: Number,
        required: true
    },
    serviceTitle: {
        type: String,
        required: true
    },
    termsAndCondition: {
        type: String,
        required: true
    },
    vendorId: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    },
   
},
    {
        timestamps: true
    })
