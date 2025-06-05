export interface IUpdateServiceStatusUseCase {
	execute(serviceId: string, status: string): Promise<void>
}