import { UserDto } from "../../../../shared/dtos/client.dto";
import { IPaginatedUsers } from "../../../entities/paginated/paginated-users.entity";

export interface IGetAllUsersUseCase {
	execute(
		userType: string,
		pageNumber: number,
		pageSize: number,
		searchTerm: string
	): Promise<{users: UserDto[], total: number}>;
}
