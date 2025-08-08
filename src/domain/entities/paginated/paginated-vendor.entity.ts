import { VendorDTO } from "../../../shared/dtos/vendor.dto";

export interface IPaginatedVendor {
  vendor: VendorDTO[] | [];
	total: number;
}
