import { inject, injectable } from "tsyringe";
import { IChangePasswordUseCase } from "../../domain/interface/useCaseInterface/users/change-password-usecase.interface";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IPasswordHasher } from "../../domain/interface/useCaseInterface/auth/passwordHasher.interface";




@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
    constructor(
       @inject("IClientRepository")
       private _clientRepository: IClientRepository,
       @inject("IVendorRepository")
       private _vendorRepository: IVendorRepository,
       @inject("IPasswordHasher")
       private _passwordHasher: IPasswordHasher 
    ) {}

    async execute(userId: string, currentPassword: string, newPassword: string, role: string): Promise<void> {

      console.log("🚀 ~ ChangePasswordUseCase ~ execute ~ role:", currentPassword,newPassword)
             let repo;
             let idField;
             if(role === "client"){
                repo = this._clientRepository
                idField = "clientId";
             }else if(role === "vendor"){
               repo = this._vendorRepository
               idField = "vendorId";
             }else {
              throw new CustomError(
                ERROR_MESSAGES.INVALID_ROLE,
                HTTP_STATUS.BAD_REQUEST
              )
             }

       const user = await repo.findOne({userId});
       if (!user) {
        throw new CustomError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      
       const isPasswordValid = await this._passwordHasher.compare(currentPassword, user?.password);
       console.log('[ioioioioiopiopippo=rs')

       if (!isPasswordValid) {
           throw new CustomError(
             ERROR_MESSAGES.WRONG_CURRENT_PASSWORD,
             HTTP_STATUS.BAD_REQUEST
           )
       }

       if(newPassword === currentPassword){
        throw new CustomError(
          ERROR_MESSAGES.PASSWORD_SAME,
          HTTP_STATUS.BAD_REQUEST
        )
       }

      const hashedPassword = await this._passwordHasher.hash(newPassword);

      await repo.update(
         {userId},
         {password: hashedPassword}
        );

    }
}