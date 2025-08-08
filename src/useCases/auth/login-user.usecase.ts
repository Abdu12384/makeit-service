import { inject, injectable } from "tsyringe";
import { ILoginUserUseCase } from "../../domain/interface/useCaseInterface/auth/login.usecase.interface";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { IAdminRepository } from "../../domain/interface/repositoryInterfaces/users/admin.repository.interface";
import { ILoginUserDTO } from "../../shared/dtos/user.dto";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IPasswordHasher } from "../../domain/interface/useCaseInterface/auth/passwordHasher.interface";
import { UserDto } from "../../shared/dtos/client.dto";
import { plainToInstance } from "class-transformer";




@injectable()

export class LoginUserUseCase implements ILoginUserUseCase{

    constructor(
      @inject("IClientRepository")
      private _clientRepository: IClientRepository,

      @inject("IVendorRepository")
      private _vendorRepository: IVendorRepository,

      @inject("IAdminRepository")
      private _adminRepository: IAdminRepository,

      @inject("IPasswordHasher")
      private _passwordBcrypt: IPasswordHasher

    ){}


    async execute(user: ILoginUserDTO): Promise<UserDto> {
 
         let repository;

         if(user.role === 'client'){
           repository = this._clientRepository;
         }else if(user.role === 'vendor'){
          repository = this._vendorRepository;
         }else if(user.role === 'admin'){
            repository = this._adminRepository       
         }else{
           throw new CustomError(
             ERROR_MESSAGES.INVALID_ROLE,
             HTTP_STATUS.BAD_REQUEST
           )
         }

         if(!user.email||!user.password){
            throw new CustomError(
              ERROR_MESSAGES.INVALID_CREDENTIALS,
              HTTP_STATUS.BAD_REQUEST
            )
         }

         const userData = await repository.findOne({email: user.email})
         if(!userData){
            throw new CustomError(
              ERROR_MESSAGES.USER_NOT_FOUND,
              HTTP_STATUS.NOT_FOUND
            )
         }

         if(userData.status === "pending"){
            throw new CustomError(
               ERROR_MESSAGES.ACCOUNT_UNDER_VERIFICATION,
               HTTP_STATUS.FORBIDDEN
            )
         }

         if(userData.status !== "active"){
            throw new CustomError(
              ERROR_MESSAGES.BLOCKED,
              HTTP_STATUS.FORBIDDEN
            )
         }

         if(user.password){
           const isPasswordMatch = await this._passwordBcrypt.compare(
            user.password,
            userData.password
           )
           if(!isPasswordMatch){
             throw new CustomError(
               ERROR_MESSAGES.INVALID_CREDENTIALS,
               HTTP_STATUS.FORBIDDEN
             )
           }
         }
       const users: UserDto = plainToInstance(UserDto, userData , { excludeExtraneousValues: true }); 
         console.log(users)
         return users
    }

}