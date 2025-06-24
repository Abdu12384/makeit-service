import { inject, injectable } from "tsyringe";
import { IResetPasswordUseCase } from "../../domain/interface/useCaseInterface/auth/reset-password-usecase.interface";
import { ITokenService } from "../../domain/interface/servicesInterface/jwt-service.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { JwtPayload } from "jsonwebtoken";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { IPasswordHasher } from "../../domain/interface/useCaseInterface/auth/passwordHasher.interface";










@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase{

    constructor(
        @inject("ITokenService")
        private _jwtService : ITokenService,

        @inject("IClientRepository")
        private _clientRepository : IClientRepository,

        @inject("IVendorRepository")
        private _vendorRepository : IVendorRepository,

        @inject("IPasswordHasher")
        private _passwordHasher : IPasswordHasher,
      ) {} 

      async execute(token: string, password: string): Promise<void> {
        
        const varifyToken = await this._jwtService.verifyAccessToken(token)

        if(!varifyToken){
            throw new CustomError(
              ERROR_MESSAGES.INVALID_TOKEN,
              HTTP_STATUS.UNAUTHORIZED
            )
        }
        const {userId,role} = varifyToken as JwtPayload


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

        const hashedPassword = await this._passwordHasher.hash(password)

        const isPasswordSame = await this._passwordHasher.compare(password, hashedPassword)

        if(isPasswordSame){
          throw new CustomError(
            ERROR_MESSAGES.PASSWORD_SAME,
            HTTP_STATUS.BAD_REQUEST
          )
        }

        const user = await repository.update(
          {userId},
          {password: hashedPassword}
        )

        console.log('user',user)

        if(!user){
            throw new CustomError(
              ERROR_MESSAGES.USER_NOT_FOUND,
              HTTP_STATUS.NOT_FOUND
            )
        }

      }
         
      
}

