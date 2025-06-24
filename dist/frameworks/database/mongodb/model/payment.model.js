"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentModel = void 0;
const mongoose_1 = require("mongoose");
const payment_schema_1 = require("../schema/payment.schema");
exports.paymentModel = (0, mongoose_1.model)('payment', payment_schema_1.paymentSchema);
//# sourceMappingURL=payment.model.js.map