"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionModel = void 0;
const mongoose_1 = require("mongoose");
const transaction_schema_1 = require("../schema/transaction.schema");
exports.transactionModel = (0, mongoose_1.model)('transaction', transaction_schema_1.transactionSchema);
//# sourceMappingURL=transaction.model.js.map