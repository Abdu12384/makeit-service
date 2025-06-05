
export interface IEditServiceUseCase {
	execute(serviceId: string, data: any): Promise<any>
}