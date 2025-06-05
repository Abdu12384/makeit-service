import { IAdminEntity } from "../../../entities/admin.entity.js";
import { IVendorEntity } from "../../../entities/vendor.entity.js";
import { IClientEntity } from "../../../entities/client.entity.js";

export interface IUpdateUserDetailsUseCase {
	execute(
		userId: string,
		role: string,
		userDetails: Record<string, any>
	): Promise<IAdminEntity | IClientEntity | IVendorEntity | null>;
}
