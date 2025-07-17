import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/error.handler";
import { IWorkSampleController } from "../../domain/interface/controllerInterfaces/work-sample/work-sample-controller.interface";
import { IAddWorkSampleUseCase } from "../../domain/interface/useCaseInterface/work-sample/add-work-sample-usecase.interface";
import { IUpdateWorkSampleUseCase } from "../../domain/interface/useCaseInterface/work-sample/update-work-sample-usecase.interface";
import { IGetAllWorkSampleByIdUseCase } from "../../domain/interface/useCaseInterface/work-sample/get-all-work-sample-by-id-usecase.interface";












@injectable()
export class WorkSampleController implements IWorkSampleController {
    
    constructor(
        @inject("IAddWorkSampleUseCase")
        private _addWorkSampleUseCase: IAddWorkSampleUseCase,

        @inject("IUpdateWorkSampleUseCase")
        private _updateWorkSampleUseCase: IUpdateWorkSampleUseCase,

        @inject("IGetAllWorkSampleByIdUseCase")
        private _getAllWorkSamplesUseCase: IGetAllWorkSampleByIdUseCase,
    ){}
    


 // ══════════════════════════════════════════════════════════
 //   Get All Work Sample
 // ══════════════════════════════════════════════════════════
  
    async getAllWorkSamplesByVendorId(req: Request, res: Response): Promise<void> {
      try {
        const {page,limit} = req.query
        const {vendorId} = req.params
        const {userId, role} = (req as CustomRequest).user 
        const pageNumber = Number(page) || 1
        const pageSize = Number(limit) || 10
 
        let providerId = vendorId 
        if(role === "client"){
         providerId = vendorId 
        }else{
         providerId = userId
        }
       
        const workSamples = await this._getAllWorkSamplesUseCase.execute(
          providerId,
          pageNumber,
          pageSize
        )
        res.status(HTTP_STATUS.OK).json({
          success: true,
          workSamples,
        })
        
      } catch (error) {
        handleErrorResponse(req,res, error)
      }
    }
    
    



    
 // ══════════════════════════════════════════════════════════
 //   Create Work Sample
 // ══════════════════════════════════════════════════════════
  
    async createWorkSample(req: Request, res: Response): Promise<void> {

      try {
        const {title, description, images,} = req.body
        const {userId, role} = (req as CustomRequest).user 
        if(!userId || role !== "vendor"){
          res.status(HTTP_STATUS.BAD_REQUEST).json({
             success: false,
             message: ERROR_MESSAGES.MISSING_PARAMETERS,
          })
          return  
        }

        const workSample = await this._addWorkSampleUseCase.execute(
          {
            title,
            description,
            images,
            vendorId: userId
          }
        )
        res.status(HTTP_STATUS.OK).json({
          success: true,
          message:SUCCESS_MESSAGES.CREATED
        })
        
      } catch (error) {
        handleErrorResponse(req,res, error)
      }
        
    }



    
 // ══════════════════════════════════════════════════════════
 //   Update Work Sample
 // ══════════════════════════════════════════════════════════
  
    async updateWorkSample(req: Request, res: Response): Promise<void> {
      try {
        const {workSampleId} = req.params
        const {title, description, images,} = req.body
        const {userId, role} = (req as CustomRequest).user 
        if(!userId || role !== "vendor"){
          res.status(HTTP_STATUS.BAD_REQUEST).json({
             success: false,
             message: ERROR_MESSAGES.MISSING_PARAMETERS,
          })
          return  
        }

        const workSample = await this._updateWorkSampleUseCase.execute(
          workSampleId,
          {
            title,
            description,
            images,
          }
        )
        res.status(HTTP_STATUS.OK).json({
          success: true,
          message:SUCCESS_MESSAGES.UPDATE_SUCCESS
        })
        
      } catch (error) {
        handleErrorResponse(req,res, error)
      }
    }

    
}