import { IAdminEntity } from "../../../entities/admin.entity";
import { IVendorEntity } from "../../../entities/vendor.entity";
import { IClientEntity } from "../../../entities/client.entity";

export interface IUpdateUserDetailsUseCase {
	execute(
		userId: string,
		role: string,
		userDetails: IAdminEntity | IClientEntity | IVendorEntity
	): Promise<IAdminEntity | IClientEntity | IVendorEntity | null>;
}
