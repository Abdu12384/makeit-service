import {injectable} from 'tsyringe'
import { IClientEntity } from "../../../domain/entities/client.entity.js";
import { IClientRepository } from "../../../domain/interface/repositoryInterfaces/users/client.repository.interface.js";
import { ClientModel, IClientModel } from "../../../frameworks/database/mongodb/model/clientModel.js";
import { BaseRepository } from '../base.repository.js';

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
   
}

