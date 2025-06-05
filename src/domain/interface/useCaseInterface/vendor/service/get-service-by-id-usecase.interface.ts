import { IServiceEntity } from "../../../../entities/service.entity";

export interface IGetServiceByIdUseCase {
	execute(serviceId: string): Promise<any| null>
}