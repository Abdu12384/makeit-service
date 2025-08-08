import { UserDto } from "../../../../shared/dtos/client.dto";

export interface IGetAllUsersUseCase {
	execute(
		userType: string,
		pageNumber: number,
		pageSize: number,
		searchTerm: string
	): Promise<{users: UserDto[], total: number}>;
}
