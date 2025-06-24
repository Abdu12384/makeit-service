"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workSampleSchema = void 0;
const mongoose_1 = require("mongoose");
exports.workSampleSchema = new mongoose_1.Schema({
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