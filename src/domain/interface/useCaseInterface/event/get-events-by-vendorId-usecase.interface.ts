
export interface IGetEventsByVendorIdUseCase {
    execute(userId:string,pageNumber:number,pageSize:number):Promise<any>
}