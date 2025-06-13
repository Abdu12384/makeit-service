export interface IUpdateUserStatusUseCase {
	execute(userType: string, userId: string): Promise<void>;
}
