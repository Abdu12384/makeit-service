import { IVendorEntity } from "../vendor.entity";

export interface IPaginatedVendor {
  vendor: IVendorEntity[] | [];
	total: number;
}
