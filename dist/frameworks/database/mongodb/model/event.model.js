"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventModel = void 0;
const mongoose_1 = require("mongoose");
const event_schema_1 = require("../schema/event.schema");
exports.eventModel = (0, mongoose_1.model)('event', event_schema_1.eventSchema);
//# sourceMappingURL=event.model.js.map