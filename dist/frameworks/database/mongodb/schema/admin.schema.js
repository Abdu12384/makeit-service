"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSchema = void 0;
const mongoose_1 = require("mongoose");
exports.adminSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    isSuperAdmin: { type: Boolean, default: false },
    profileImage: { type: String },
    status: { type: String, default: "active" },
}, {
    timestamps: true
});
//# sourceMappingURL=admin.schema.js.map