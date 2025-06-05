import { injectable, inject} from "tsyringe";
import { IClientEntity } from "../../domain/entities/client.entity.js";
import { IRegisterUseCase } from "../../domain/interface/useCaseInterface/auth/register.usecase.js";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface.js";
import { IPasswordHasher } from "../../domain/interface/useCaseInterface/auth/passwordHasher.interface.js";
import { UserDTO } from "../../shared/dtos/user.dto.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { IUserExistenceService } from "../../domain/interface/servicesInterface/user-existence-service.interface.js";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";

@injectable()
export class RegisterClientUseCase implements IRegisterUseCase{
   constructor(
     @inject("IClientRepository")
      private _clientRepository: IClientRepository,

      @inject("IUserExistenceService")
      private _emailExistenService: IUserExistenceService,

      @inject("IPasswordHasher")
      private _passwordHasher: IPasswordHasher,

      @inject("IVendorRepository")
      private _vendorRepository: IVendorRepository

   ) {}

async createUsers(user: UserDTO): Promise<IClientEntity | null> {
  console.log('useCase',user)
   const {role, email, password} = user

       const {exists} = await this._emailExistenService.findUserByEmail(email)
        if(exists){
           throw new CustomError(
            ERROR_MESSAGES.EMAIL_EXISTS,
            HTTP_STATUS.CONFLICT
           )
        }

        const hashedPassword = password 
        ? await this._passwordHasher.hash(password)
        :null;

        const userId = generateUniqueId(role)


        let repository;
        if(role === "client"){
           repository = this._clientRepository
        }else if (role === 'vendor'){
           repository = this._vendorRepository
        } else{
           throw new CustomError(
             ERROR_MESSAGES.INVALID_ROLE,
             HTTP_STATUS.BAD_REQUEST
           )
        }
        return await repository.save(
          {
            ...user,
            password: hashedPassword ?? "",
            userId : userId
          }
        ) 
      
      }
  
}