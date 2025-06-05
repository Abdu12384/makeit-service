export interface IGetAllDashboardDataUseCase {
    execute(role:string,userId:string,period?:string,selectedDate?:Date):Promise<any>
}