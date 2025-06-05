import { IServiceEntity } from "../service.entity";

export interface IPaginatedService {
  services: IServiceEntity[] | [];
	total: number;
}