export interface IUpdateServiceStatusUseCase {
	execute(serviceId: string, status: string): Promise<void>
	blockService(serviceId: string): Promise<void>
}