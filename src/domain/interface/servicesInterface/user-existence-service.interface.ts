import { IAdminEntity } from "../../entities/admin.entity";
import { IClientEntity } from "../../entities/client.entity";
import { IVendorEntity } from "../../entities/vendor.entity";

export interface IUserExistenceService {
   findUserByEmail(email:string):Promise<{exists: boolean; user: IClientEntity | IVendorEntity | IAdminEntity | null; role: 'client' | 'vendor' | 'admin' | null;}>;
}