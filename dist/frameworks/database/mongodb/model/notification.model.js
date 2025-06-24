"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationModel = void 0;
const mongoose_1 = require("mongoose");
const notification_schema_1 = require("../schema/notification.schema");
exports.notificationModel = (0, mongoose_1.model)('notification', notification_schema_1.notificationSchema);
//# sourceMappingURL=notification.model.js.map