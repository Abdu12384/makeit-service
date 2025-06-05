import { BaseRepository } from "../base.repository";
import { messageModel } from "../../../frameworks/database/mongodb/model/message.model";
export class MessageRepository extends BaseRepository {
    constructor() {
        super(messageModel);
    }
}
//# sourceMappingURL=message.repository.js.map