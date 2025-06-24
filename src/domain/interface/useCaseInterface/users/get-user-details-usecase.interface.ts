import { TRole } from "../../../../shared/constants";
import { UserDTO } from "../../../../shared/dtos/user.dto";
import { IAdminEntity } from "../../../entities/admin.entity";
import { IVendorEntity } from "../../../entities/vendor.entity";
import { IClientEntity } from "../../../entities/client.entity";

export interface IGetUserDetailsUseCase {
	execute(
		userId: string,
		role: TRole
	): Promise<IVendorEntity | IAdminEntity | IClientEntity>;
}
