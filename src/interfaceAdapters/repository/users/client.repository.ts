import {injectable} from 'tsyringe'
import { IClientEntity } from "../../../domain/entities/client.entity";
import { IClientRepository } from "../../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { ClientModel, IClientModel } from "../../../frameworks/database/mongodb/model/clientModel";
import { BaseRepository } from '../base.repository';

@injectable()
export class ClientRepository extends BaseRepository<IClientModel>{
    constructor(){
      super(ClientModel)
    }
   async createClient(client: IClientEntity): Promise<IClientEntity | null> {
       return await ClientModel.create(client)
   }

   async findByEmail(email: string): Promise<IClientEntity | null> {
     return await ClientModel.findOne({email:email})
   }

   async updateFcmToken(userId: string, token: string): Promise<void> {
    await ClientModel.updateOne({ userId }, { $set: { fcmToken: token } });
   }

   async clearFcmToken(userId: string): Promise<void> {
    await ClientModel.updateOne({ userId }, { $unset: { fcmToken: "" } });
   }
    
}

