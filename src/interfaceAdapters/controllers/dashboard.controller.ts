import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IDashboardControllerInterface } from "../../domain/interface/controllerInterfaces/dashboard/dashboard-controller.interface";
import { CustomRequest } from "../middlewares/auth.middleware";
import { HTTP_STATUS } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/error.handler";
import { SUCCESS_MESSAGES } from "../../shared/constants";
import { IGetAllDashboardDataUseCase } from "../../domain/interface/useCaseInterface/dashboard/get-all-dashboard-data-usecase.interface";











@injectable()
export default class DashboardController implements IDashboardControllerInterface {

    constructor(
        @inject("IGetAllDashboardDataUseCase")
        private _getAllDashboardDataUseCase: IGetAllDashboardDataUseCase
    ){}
    
    async getAllDashboardData(req:Request,res:Response):Promise<void>{
        const {role,userId} = (req as unknown as CustomRequest).user
        const {period } = req.query 

    
      
      try {
          const data = await this._getAllDashboardDataUseCase.execute(
            role,
            userId,
            // period as string,
            // selectedDate
          )

          res.status(HTTP_STATUS.OK).json({
              success:true,
              data,
          })
      } catch (error) {
        handleErrorResponse(req,res,error)
      }
    }
}