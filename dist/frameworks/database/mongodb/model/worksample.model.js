"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workSampleModel = void 0;
const mongoose_1 = require("mongoose");
const worksample_schema_1 = require("../schema/worksample.schema");
exports.workSampleModel = (0, mongoose_1.model)('workSample', worksample_schema_1.workSampleSchema);
//# sourceMappingURL=worksample.model.js.map