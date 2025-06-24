"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceModel = void 0;
const mongoose_1 = require("mongoose");
const service_schema_1 = require("../schema/service.schema");
exports.serviceModel = (0, mongoose_1.model)("Service", service_schema_1.serviceSchema);
//# sourceMappingURL=service.model.js.map