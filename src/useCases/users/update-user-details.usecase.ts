import { inject, injectable } from "tsyringe";
import { IUpdateUserDetailsUseCase } from "../../domain/interface/useCaseInterface/users/update-user-details-usecase.interface";
import { IAdminEntity } from "../../domain/entities/admin.entity";
import { IClientEntity } from "../../domain/entities/client.entity";
import { IVendorEntity } from "../../domain/entities/vendor.entity";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { IAdminRepository } from "../../domain/interface/repositoryInterfaces/users/admin.repository.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { UserDto } from "../../shared/dtos/client.dto";
import { plainToInstance } from "class-transformer";







@injectable()

export class UpdateUserDetailsUseCase implements IUpdateUserDetailsUseCase{
  constructor(

    @inject("IClientRepository")
    private _clientRepository : IClientRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IAdminRepository")
    private _adminRepository: IAdminRepository

  ){}


  async execute(userId: string, role: string, userDetails: IAdminEntity | IClientEntity | IVendorEntity): Promise<UserDto | null> {
     let repository; 
      
      if(role === "client"){
        repository = this._clientRepository
      } else if (role === "vendor"){
         repository = this._vendorRepository
      }else if (role === "admin"){
         repository = this._adminRepository
      }else{
        throw new CustomError(
           ERROR_MESSAGES.INVALID_ROLE,
           HTTP_STATUS.BAD_REQUEST
        )
      }

      const user = await repository.update({userId},userDetails)

      if(!user){
         throw new CustomError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
         )
      }
       const users: UserDto = plainToInstance(UserDto, user , { excludeExtraneousValues: true }); 
      return users
  }
}
