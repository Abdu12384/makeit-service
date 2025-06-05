import { Schema } from "mongoose";
import { IWorkSampleModel } from "../model/worksample.model.js";

export const workSampleSchema = new Schema<IWorkSampleModel>({
    workSampleId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    vendorId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})