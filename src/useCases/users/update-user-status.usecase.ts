import { inject, injectable } from "tsyringe";
import { IUpdateUserStatusUseCase } from "../../domain/interface/useCaseInterface/users/update-user-status-usecase.interface";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";



@injectable()
export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
      constructor(
        @inject("IClientRepository")
        private _clientRepository: IClientRepository,

        @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository
      ) {}


      async execute(userType: string, userId: string): Promise<void> {
         let repo;

         if(userType === "client"){
            repo = this._clientRepository
         }else if(userType === "vendor"){
           repo = this._vendorRepository
         }else {
          throw new CustomError(
            ERROR_MESSAGES.INVALID_ROLE,
            HTTP_STATUS.BAD_REQUEST
          )
         }
         const user = await repo.findOne({userId})

         if(!user){
          throw new CustomError(
             ERROR_MESSAGES.USER_NOT_FOUND,
             HTTP_STATUS.NOT_FOUND
          )
         }

         const newStatus = user.status === "active" ? "blocked" : "active"

         await repo.update(
            {userId},
            {
              status: newStatus,
            }
         )
      }
}