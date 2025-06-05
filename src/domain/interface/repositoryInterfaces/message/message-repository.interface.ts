import { IBaseRepository } from "../base-repository.interface";
import { IMessageEntity } from "../../../entities/message.entity";





export interface IMessageRepository extends IBaseRepository<IMessageEntity> {}