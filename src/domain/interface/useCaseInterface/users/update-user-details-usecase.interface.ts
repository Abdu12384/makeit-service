import { IAdminEntity } from "../../../entities/admin.entity";
import { IVendorEntity } from "../../../entities/vendor.entity";
import { IClientEntity } from "../../../entities/client.entity";
import { UserDto } from "../../../../shared/dtos/client.dto";

export interface IUpdateUserDetailsUseCase {
	execute(
		userId: string,
		role: string,
		userDetails: IAdminEntity | IClientEntity | IVendorEntity
	): Promise<UserDto | null>;
}
