import { Request, Response } from "express";

export interface IDashboardControllerInterface {
    getAllDashboardData(req:Request,res:Response):Promise<void>
}
    
