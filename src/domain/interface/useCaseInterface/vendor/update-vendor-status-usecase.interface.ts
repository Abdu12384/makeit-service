import { statusTypes } from "../../../../shared/constants";

export interface IUpdateVendorStatusUseCase {
	execute(id: string, status: statusTypes, message?: string): Promise<void>;
}
