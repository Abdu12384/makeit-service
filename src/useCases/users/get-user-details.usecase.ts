import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { IAdminRepository } from "../../domain/interface/repositoryInterfaces/users/admin.repository.interface";
import { IGetUserDetailsUseCase } from "../../domain/interface/useCaseInterface/users/get-user-details-usecase.interface";
import { IAdminEntity } from "../../domain/entities/admin.entity";
import { IClientEntity } from "../../domain/entities/client.entity";
import { IVendorEntity } from "../../domain/entities/vendor.entity";
import { ERROR_MESSAGES, HTTP_STATUS, TRole } from "../../shared/constants";
import { CustomError } from "../../domain/utils/custom.error";





@injectable()
export class GetUserDetailsUseCase implements IGetUserDetailsUseCase {
   constructor(
      @inject("IClientRepository")
      private _clientRepository: IClientRepository,

       @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository,

        @inject("IAdminRepository")
        private _adminRepository: IAdminRepository,
      
   ){}

 async execute(userId: string, role: TRole): Promise<IVendorEntity | IAdminEntity | IClientEntity> {
  let repository;
  if (role === "client") {
    repository = this._clientRepository;
  } else if (role === "vendor") {
    repository = this._vendorRepository;
  } else if (role === "admin") {
    repository = this._adminRepository;
  } else {
    throw new CustomError(
      ERROR_MESSAGES.INVALID_ROLE,
      HTTP_STATUS.BAD_REQUEST
    );
  }
  const user = await repository.findOne({ userId });

  if (!user) {
    throw new CustomError(
      ERROR_MESSAGES.USER_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND
    );
  }
  return user;
 }
   
}