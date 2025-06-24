"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.categorySchema = new mongoose_1.Schema({
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