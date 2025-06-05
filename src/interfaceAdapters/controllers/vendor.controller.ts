import { inject, injectable } from "tsyringe";
import {  IVendorController } from "../../domain/interface/controllerInterfaces/vendor/vendor-controller.interface.js";
import { Request, Response } from "express";
import { IGetAllVendorUseCase } from "../../domain/interface/useCaseInterface/vendor/get-all-vendor-usecase.interface.js";
import { table } from "console";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IUpdateVendorStatusUseCase } from "../../domain/interface/useCaseInterface/vendor/update-vendor-status-usecase.interface.js";











@injectable()
export class VendorCantroller implements IVendorController{
      constructor(
        
         @inject("IGetAllVendorUseCase")
         private _getAllVendorUseCase: IGetAllVendorUseCase,

         @inject("IUpdateVendorStatusUseCase")
         private _updateVendorStatusUseCase : IUpdateVendorStatusUseCase

      ){}


// ══════════════════════════════════════════════════════════
//   Get All Vendors
// ══════════════════════════════════════════════════════════
  

  async getAllVendors(req: Request, res: Response): Promise<void> {
      try {
          console.log('qury here',req.query)
         const {page = 1, limit = 10, search = "", forType} = req.query
         const pageNumber = Number(page)
         const pageSize = Number(limit)
         const forTypeString = typeof forType === "string" ? forType : "non-active"
         const searchTermString = typeof search === "string" ? search : ""

         const { vendor, total} = await this._getAllVendorUseCase.execute(
             forTypeString,
             pageNumber,
             pageSize,
             searchTermString
         )
         console.log(vendor, total)
         res.status(HTTP_STATUS.OK).json({
            success:true,
            vendor,
            totalPage :total,
            currentPage: pageNumber
         })

      } catch (error) {
        handleErrorResponse(res, error)
      }
  }





// ══════════════════════════════════════════════════════════
//  Update Vendor Status
// ══════════════════════════════════════════════════════════
  
async updateVendorStatus(req: Request, res: Response): Promise<void> {
    try {
       const { vendorId } = req.params
       const {status, message} = req.body

       if(!vendorId || !status){
         res.status(HTTP_STATUS.BAD_REQUEST).json({
           message: ERROR_MESSAGES.MISSING_PARAMETERS,
           success: false
         })
         return 
       }
  
       const vendor = await  this._updateVendorStatusUseCase.execute(
         vendorId,
         status,
         message || ""
       )

       res.status(HTTP_STATUS.OK).json({
         success: true,
         message: SUCCESS_MESSAGES.UPDATE_SUCCESS
       })
    } catch (error) {
      handleErrorResponse(res, error)
    }
}



}