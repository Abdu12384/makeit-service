"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorModel = void 0;
const mongoose_1 = require("mongoose");
const vendor_schema_1 = require("../schema/vendor.schema");
exports.VendorModel = (0, mongoose_1.model)("vendor", vendor_schema_1.VendorSchema);
//# sourceMappingURL=vendor.model.js.map