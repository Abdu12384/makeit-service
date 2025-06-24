"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = void 0;
const mongoose_1 = require("mongoose");
const message_schema_1 = require("../schema/message.schema");
exports.messageModel = (0, mongoose_1.model)("Message", message_schema_1.messageSchema);
//# sourceMappingURL=message.model.js.map