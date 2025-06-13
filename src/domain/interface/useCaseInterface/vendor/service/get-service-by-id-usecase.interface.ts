import { IServiceWithVendor } from "../../../../entities/DTO/service-with-vendor.dto";
import { IServiceEntity } from "../../../../entities/service.entity";
import { IVendorEntity } from "../../../../entities/vendor.entity";

export interface IGetServiceByIdUseCase {
	execute(serviceId: string): Promise<IServiceWithVendor | null>
}