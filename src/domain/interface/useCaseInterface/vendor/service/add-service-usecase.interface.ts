import { IServiceEntity } from "../../../../entities/service.entity";

export interface IAddServiceUseCase {
	execute(data: Partial<IServiceEntity>): Promise<void>;
}
