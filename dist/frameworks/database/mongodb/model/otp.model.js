"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpModel = void 0;
const mongoose_1 = require("mongoose");
const otp_schema_1 = require("../schema/otp.schema");
exports.otpModel = (0, mongoose_1.model)("Otp", otp_schema_1.otpSchema);
//# sourceMappingURL=otp.model.js.map