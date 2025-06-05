export interface IGetAllBookingUseCase{
    execute(pageNumber:number,pageSize:number,role:string,userId:string): Promise<any>
}