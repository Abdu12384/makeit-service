import { VendorDTO } from "../../../shared/dtos/vendor.dto";
import { IVendorEntity } from "../vendor.entity";

export interface IPaginatedVendor {
  vendor: VendorDTO[] | [];
	total: number;
}
