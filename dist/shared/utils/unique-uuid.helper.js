"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = void 0;
const crypto_1 = require("crypto");
const generateUniqueId = (prefix = "user") => {
    return `makeit-${prefix}-${(0, crypto_1.randomUUID)().slice(10)}`;
};
exports.generateUniqueId = generateUniqueId;
//# sourceMappingURL=unique-uuid.helper.js.map