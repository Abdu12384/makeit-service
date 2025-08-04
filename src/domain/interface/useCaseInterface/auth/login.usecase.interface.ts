import { ILoginUserDTO } from "../../../../shared/dtos/user.dto";
import { IAdminEntity } from "../../../entities/admin.entity";
import { IClientEntity } from "../../../entities/client.entity";
import { IVendorEntity } from "../../../entities/vendor.entity";


export interface ILoginUserUseCase{
   execute(
     user:ILoginUserDTO
   ):Promise<Partial<IVendorEntity | IAdminEntity | IClientEntity>>
} 