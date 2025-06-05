import { TRole } from "../../../../shared/constants";
import { IClientEntity } from "../../../entities/client.entity";
import { IVendorEntity } from "../../../entities/vendor.entity";



export interface IGoogleUseCase {
    execute(
      credential: string,
      client_id: string,
      role: TRole
    ): Promise<Partial<IVendorEntity | IClientEntity>>
}