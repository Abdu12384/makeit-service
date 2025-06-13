import { IServiceEntity } from "../../../../entities/service.entity";

export interface IEditServiceUseCase {
	execute(serviceId: string, data: IServiceEntity): Promise<void>
}