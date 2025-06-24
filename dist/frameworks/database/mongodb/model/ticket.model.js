"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketModel = void 0;
const mongoose_1 = require("mongoose");
const ticket_schema_1 = require("../schema/ticket.schema");
exports.ticketModel = (0, mongoose_1.model)('ticket', ticket_schema_1.ticketSchema);
//# sourceMappingURL=ticket.model.js.map