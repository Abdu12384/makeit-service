import { BaseRepository } from "../base.repository";
import { IMessageRepository } from "../../../domain/interface/repositoryInterfaces/message/message-repository.interface";
import { IMessageModel, messageModel } from "../../../frameworks/database/mongodb/model/message.model";









export class MessageRepository extends BaseRepository<IMessageModel> implements IMessageRepository {
    constructor() {
        super(messageModel);
    }
}