import { IServiceEntity } from "../service.entity";
import { IVendorEntity } from "../vendor.entity";

export interface IServiceWithVendor {
  service: IServiceEntity;
  vendor: IVendorEntity | null;
}