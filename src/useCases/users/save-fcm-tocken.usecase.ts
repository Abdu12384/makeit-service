import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface.js";
import { ISaveFCMTokenUseCase } from "../../domain/interface/useCaseInterface/users/save-fcm-token-usecase.interface.js";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface.js";






@injectable()
export class SaveFCMTokenUseCase implements ISaveFCMTokenUseCase {
   constructor(
      @inject("IClientRepository")
      private _clientRepository: IClientRepository,

      @inject("IVendorRepository")
      private _vendorRepository: IVendorRepository,
   ){}

   async execute(userId: string, token: string, role: string): Promise<void> {
      
       if(role === "client"){
         await this._clientRepository.updateFcmToken(userId, token)
       }
       if(role === "vendor"){
         await this._vendorRepository.updateFcmToken(userId, token)
       }
   }
}