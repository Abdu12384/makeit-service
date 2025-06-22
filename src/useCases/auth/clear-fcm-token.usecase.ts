import { inject, injectable } from "tsyringe";
import { IClearFCMTokenUseCase } from "../../domain/interface/useCaseInterface/auth/clear-fcm-token-usecase.interface.js";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface.js";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface.js";





@injectable()
export class ClearFCMTokenUseCase implements IClearFCMTokenUseCase {
    
    constructor(
      @inject("IClientRepository")
      private _clientUserRepository: IClientRepository,
      @inject("IVendorRepository")
      private _vendorRepository: IVendorRepository
    ) {}

    async execute(userId: string,role: string): Promise<void> {
        
      if(role === "client"){
        await this._clientUserRepository.clearFcmToken(userId)
      }else if(role === "vendor"){
        await this._vendorRepository.clearFcmToken(userId)
      }
    }
}
