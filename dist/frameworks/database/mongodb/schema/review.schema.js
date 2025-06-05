import { Schema } from "mongoose";
export const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    reviewerId: {
        type: String,
        required: true,
        ref: 'client'
    },
    targetType: {
        type: String,
        enum: ['service', 'event'],
        required: true
    },
    targetId: {
        type: String,
        required: true,
        refPath: 'targetType'
    }
}, {
    timestamps: true
});
//# sourceMappingURL=review.schema.js.map