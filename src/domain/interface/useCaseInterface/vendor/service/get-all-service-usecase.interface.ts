import { IPaginatedService } from "../../../../entities/paginated/paginated-service.entity";


export interface IGetAllServicesUseCase {
	execute(pageNumber: number, pageSize: number, search: string, role: string, vendorId?: string): Promise<IPaginatedService | null>;
}
