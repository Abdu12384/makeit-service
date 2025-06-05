import { IVendorEntity } from "../vendor.entity";
import { IClientEntity } from "../client.entity";

export interface IPaginatedUsers {
	users: IClientEntity[] | IVendorEntity[] | [];
	total: number;
}
