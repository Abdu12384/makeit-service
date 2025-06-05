import { Schema } from 'mongoose';
export const categorySchema = new Schema({
    categoryId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
//# sourceMappingURL=category.schema.js.map