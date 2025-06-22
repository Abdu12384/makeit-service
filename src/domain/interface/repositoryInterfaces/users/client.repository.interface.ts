import { IClientEntity } from "../../../entities/client.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IClientRepository extends IBaseRepository<IClientEntity>{
   createClient(client: IClientEntity): Promise<IClientEntity|null>
   findByEmail(email: string): Promise<IClientEntity|null>
   updateFcmToken(userId: string, token: string): Promise<void>;
   clearFcmToken(userId: string): Promise<void>;
}