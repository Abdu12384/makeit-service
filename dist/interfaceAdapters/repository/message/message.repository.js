"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const base_repository_1 = require("../base.repository");
const message_model_1 = require("../../../frameworks/database/mongodb/model/message.model");
class MessageRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(message_model_1.messageModel);
    }
}
exports.MessageRepository = MessageRepository;
//# sourceMappingURL=message.repository.js.map