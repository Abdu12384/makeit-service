import { inject, injectable } from "tsyringe";
import { IGetAllUsersUseCase } from "../../domain/interface/useCaseInterface/users/get-all-users-usecase.interface.js";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface.js";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface.js";
import { IPaginatedUsers } from "../../domain/entities/paginated/paginated-users.entity.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";






@injectable()

export class GetAllUserUseCase implements IGetAllUsersUseCase{
      constructor(
      @inject("IClientRepository")
      private _clientRepository: IClientRepository,

      @inject("IVendorRepository")
      private _vendorRepository: IVendorRepository,

      ){}

      async execute(userType: string, pageNumber: number, pageSize: number, searchTerm: string): Promise<IPaginatedUsers> {
          let filter: any = {}
          if(userType){
            filter.role = userType
          }
      console.log('userType',userType)
          if(searchTerm){
             filter.$or=[
               {name:{$regex: searchTerm, $options:"i"}},
               {email:{$regex: searchTerm, $options:"i"}}
             ]
          }
          
          
          let repo;
          if(userType === "client"){
            repo = this._clientRepository
          }else if(userType === "vendor"){
            repo = this._vendorRepository
            filter.vendorStatus = "approved";
          }else{
            throw new CustomError(
              ERROR_MESSAGES.INVALID_ROLE,
              HTTP_STATUS.BAD_REQUEST
            )
          }

          const validPageNumber = Math.max(1, pageNumber || 1);
          const validPageSize = Math.max(1, pageSize || 10)
          const skip = (validPageNumber - 1) * validPageSize;
          const limit = validPageSize;
          
       const sort = { createdAt: -1 };  

       const {items , total} = await repo.findAll(filter,skip,limit,sort);


       const response: IPaginatedUsers = {
         users: items,
         total: Math.ceil(total / validPageSize)
       }

       return response

      }
}