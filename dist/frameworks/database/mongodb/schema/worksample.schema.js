import { Schema } from "mongoose";
export const workSampleSchema = new Schema({
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
});
//# sourceMappingURL=worksample.schema.js.map