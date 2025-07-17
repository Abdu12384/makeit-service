import { IDashboardStats } from "../../../entities/dahboard.entity";

export interface IGetAllDashboardDataUseCase {
    execute(role:string,userId:string,period?:string,selectedDate?:Date):Promise<IDashboardStats>
}