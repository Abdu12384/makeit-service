import { inject, injectable } from "tsyringe";
import { IGoogleUseCase } from "../../domain/interface/useCaseInterface/auth/google-usecase.interface";
import { OAuth2Client } from "google-auth-library";
import { IRegisterUseCase } from "../../domain/interface/useCaseInterface/auth/register.usecase";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { IClientEntity } from "../../domain/entities/client.entity";
import { IVendorEntity } from "../../domain/entities/vendor.entity";
import { ERROR_MESSAGES, HTTP_STATUS, TRole } from "../../shared/constants";
import { CustomError } from "../../domain/utils/custom.error";
import { IClientDTO } from "../../shared/dtos/user.dto";
import { SendEmailUseCase } from "../common/send-email.usecase";



@injectable()
export class GoogleUseCase implements IGoogleUseCase{

   private _oAuthClient: OAuth2Client;
    constructor(
       @inject("IClientRegisterUseCase")
       private _registerUserUseCase: IRegisterUseCase,

       @inject("IClientRepository")
       private _clientRepository: IClientRepository,

       @inject("IVendorRepository")
       private _vendorRepository: IVendorRepository,

        @inject("ISendEmailUseCase")
        private _sendEmailUsecCase : SendEmailUseCase
    ) {
      this._oAuthClient = new OAuth2Client()
    }

    async execute(credential: string, client_id: string, role: TRole): Promise<Partial<IVendorEntity | IClientEntity>> {
         
          const ticket = await this._oAuthClient.verifyIdToken({
            idToken: credential,
            audience: client_id,
          })

          const payload = ticket.getPayload()
          if(!payload){
            throw new CustomError(
              "Invalid or empty token payload",
              HTTP_STATUS.UNAUTHORIZED
            )
          }

        const googleId = payload.sub
        const email = payload.email
        const profileImage = payload.picture||"";
        const name = payload.given_name || payload.family_name || ""

        if(!email){
          throw new CustomError("Email is required", HTTP_STATUS.BAD_REQUEST)
        }

        let repository;
        if(role === 'client'){
          repository = this._clientRepository
        }else if(role === 'vendor'){
           repository = this._vendorRepository
        } else {
           throw new CustomError(
              ERROR_MESSAGES.INVALID_ROLE,
              HTTP_STATUS.BAD_REQUEST
           )
        }
      const existingUser = await repository.findOne({email})

      if(existingUser){
         if(existingUser.status !== "active"){
            throw new CustomError(
              ERROR_MESSAGES.BLOCKED,
              HTTP_STATUS.FORBIDDEN
            )
         }
         return existingUser
      }

      if(role === "vendor"){
         throw new CustomError(
          "Vendor accounts cannot be created using Google. Pleas Register First",
           HTTP_STATUS.FORBIDDEN
         )
      }

      const userData: IClientDTO={
         name,
         role,
         email,
         phone:"",
         password:"",
         googleId,
         profileImage,
         googleVarified:true
      }

      const newUser = await this._registerUserUseCase.createUsers(
         userData
      )

      if(!newUser){
        throw new CustomError(
           "Registration failed",
           HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      }

      this._sendEmailUsecCase.execute(
        email,
        "Welcom to MakeIT! Your Google Registration is Complete 🎉",
        'welcom MakeIT' 
      )
        return newUser;
    }

}