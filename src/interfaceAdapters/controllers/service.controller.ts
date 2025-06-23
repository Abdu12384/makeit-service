import { inject, injectable } from "tsyringe";
import { IServiceController } from "../../domain/interface/controllerInterfaces/service/service-controller.interface.js";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { IAddServiceUseCase } from "../../domain/interface/useCaseInterface/vendor/service/add-service-usecase.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IGetAllServicesUseCase } from "../../domain/interface/useCaseInterface/vendor/service/get-all-service-usecase.interface.js";
import { IEditServiceUseCase } from "../../domain/interface/useCaseInterface/vendor/service/edit-service-usecase.interface.js";
import { IUpdateServiceStatusUseCase } from "../../domain/interface/useCaseInterface/vendor/service/update-service-status-usecase.interface.js";
import { IGetServiceByIdUseCase } from "../../domain/interface/useCaseInterface/vendor/service/get-service-by-id-usecase.interface.js";





@injectable()
export class ServiceController implements IServiceController {
      
  constructor(
    @inject("IAddServiceUseCase")
    private _addServiceUseCase: IAddServiceUseCase,
    @inject("IGetAllServicesUseCase")
    private _getAllServiceUseCase: IGetAllServicesUseCase,  
    @inject("IEditServiceUseCase")
    private _editServiceUseCase: IEditServiceUseCase,
    @inject("IUpdateServiceStatusUseCase")
    private _updateServiceStatusUseCase: IUpdateServiceStatusUseCase,
    @inject("IGetServiceByIdUseCase")
    private _getServiceByIdUseCase: IGetServiceByIdUseCase
  ){}



// ══════════════════════════════════════════════════════════
//  Add Service
// ══════════════════════════════════════════════════════════

    async addService(req: Request, res: Response): Promise<void> {
       try {
         const data = req.body
         const {userId, role} = (req as CustomRequest).user 
         if(!userId || role !== "vendor"){
           res.status(HTTP_STATUS.BAD_REQUEST).json({
              success: false,
              message: ERROR_MESSAGES.MISSING_PARAMETERS,
           })
           return  
         }
          
         const service = await this._addServiceUseCase.execute({
           ...data,
          vendorId: userId,

         })
         res.status(HTTP_STATUS.OK).json({
            success: true,
            service,
            message: SUCCESS_MESSAGES.ADDED,
         })

       } catch (error) {
        handleErrorResponse(res, error)
       }        
    }




// ══════════════════════════════════════════════════════════
//  Get All Services 
// ══════════════════════════════════════════════════════════

async getAllServices(req: Request, res: Response): Promise<void> {
      try {
        const {page, limit, search, sortBy, sortOrder} = req.query
        const pageNumber = Number(page)
        const pageSize = Number(limit)


        const customReq = req as CustomRequest;
        const user = customReq.user || null;
        const userId = user?.userId;
        const role = user?.role;

        
       

        const services = await this._getAllServiceUseCase.execute(
          pageNumber,
          pageSize,
          search as string,
          role,
          userId
        )
        console.log('services',services)
        res.status(HTTP_STATUS.OK).json({
           success: true,
           services,
        })
      } catch (error) {
        handleErrorResponse(res, error)
      }
}



// ══════════════════════════════════════════════════════════
//  Edit Service
// ══════════════════════════════════════════════════════════

async editService(req: Request, res: Response): Promise<void> {
      try {
        const {serviceId} = req.params
        const data = req.body
        const {userId, role} = (req as CustomRequest).user 
        if(!userId || role !== "vendor"){
          res.status(HTTP_STATUS.BAD_REQUEST).json({
             success: false,
             message: ERROR_MESSAGES.MISSING_PARAMETERS,
          })
          return  
        }
        
        const service = await this._editServiceUseCase.execute(
          serviceId,
          data
        )
        res.status(HTTP_STATUS.OK).json({
           success: true,
           message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
           service,
        })
      } catch (error) {
        handleErrorResponse(res, error)
      }
}





// ══════════════════════════════════════════════════════════
//  Update Service Status
// ══════════════════════════════════════════════════════════



 async updateServiceStatus(req: Request, res: Response): Promise<void> {
      try {
        const {serviceId} = req.params
        const data = req.body
        const {userId, role} = (req as CustomRequest).user 
        if(!userId || role !== "vendor"){
          res.status(HTTP_STATUS.BAD_REQUEST).json({
             success: false,
             message: ERROR_MESSAGES.MISSING_PARAMETERS,
          })
          return  
        }
        
        const service = await this._updateServiceStatusUseCase.execute(
          serviceId,
          data
        )
        res.status(HTTP_STATUS.OK).json({
           success: true,
           message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
           service,
        })
      } catch (error) {
        handleErrorResponse(res, error)
      }
   }




// ══════════════════════════════════════════════════════════
//  Block Service
// ══════════════════════════════════════════════════════════

async blockService(req: Request, res: Response): Promise<void> {
      try {
        const {serviceId} = req.params
        const {userId, role} = (req as CustomRequest).user 
        if(!userId || role !== "vendor"){
          res.status(HTTP_STATUS.BAD_REQUEST).json({
             success: false,
             message: ERROR_MESSAGES.MISSING_PARAMETERS,
          })
          return  
        }
        
        const service = await this._updateServiceStatusUseCase.blockService(
          serviceId,
        )
        res.status(HTTP_STATUS.OK).json({
           success: true,
           message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
           service,
        })
      } catch (error) {
        handleErrorResponse(res, error)
      }
   }


// ══════════════════════════════════════════════════════════
//  Get Service By Id
// ══════════════════════════════════════════════════════════

async getServiceById(req: Request, res: Response): Promise<void> {
      try {
        const {serviceId} = req.params
        const service = await this._getServiceByIdUseCase.execute(serviceId)
        res.status(HTTP_STATUS.OK).json({
           success: true,
           service,
        })
      } catch (error) {
        handleErrorResponse(res, error)
      }  
    }

   

}