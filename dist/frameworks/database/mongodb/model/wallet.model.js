"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletModel = void 0;
const mongoose_1 = require("mongoose");
const wallet_schema_1 = require("../schema/wallet.schema");
exports.walletModel = (0, mongoose_1.model)('wallet', wallet_schema_1.walletSchema);
//# sourceMappingURL=wallet.model.js.map