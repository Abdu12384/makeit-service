import { IServiceWithVendor } from "../../../../entities/DTO/service-with-vendor.dto";


export interface IGetServiceByIdUseCase {
	execute(serviceId: string): Promise<IServiceWithVendor | null>
}