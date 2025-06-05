import { TRole } from "../../../../shared/constants.js";
import { UserDTO } from "../../../../shared/dtos/user.dto.js";
import { IAdminEntity } from "../../../entities/admin.entity.js";
import { IVendorEntity } from "../../../entities/vendor.entity.js";
import { IClientEntity } from "../../../entities/client.entity.js";

export interface IGetUserDetailsUseCase {
	execute(
		userId: string,
		role: TRole
	): Promise<IVendorEntity | IAdminEntity | IClientEntity>;
}
