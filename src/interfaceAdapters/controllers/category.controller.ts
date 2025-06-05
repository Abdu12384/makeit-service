import { inject, injectable } from "tsyringe";
import { ICategoryController } from "../../domain/interface/controllerInterfaces/category/category-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { Request, Response } from "express";
import { ICategoryUseCase } from "../../domain/interface/useCaseInterface/admin/create-category-usecase.interface.js";
import { IGetCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/get-category-usecase.interface.js";
import { IUpdateStatusCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/update-category-usecase.interface.js";
import { IEditCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/edit-category-usecase.interface.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";






@injectable()
export class CategoryController implements ICategoryController {
   constructor(
      @inject("ICategoryUseCase")
      private _createCategoryUseCase: ICategoryUseCase,
      @inject("IGetCategoryUseCase")
      private _getAllCategoriesUseCase: IGetCategoryUseCase,
      @inject("IUpdateStatusCategoryUseCase")
      private _updateStatusCategoryUseCase: IUpdateStatusCategoryUseCase,
      @inject("IEditCategoryUseCase")
      private _editCategoryUseCase: IEditCategoryUseCase
   ){}





// ══════════════════════════════════════════════════════════
//  Create Category
// ══════════════════════════════════════════════════════════

   async createCategory(req:Request,res:Response):Promise<void>{
        try {
            const data = req.body
            console.log(data)
            const category = await this._createCategoryUseCase.execute(data)
            res.status(HTTP_STATUS.OK).json({
                success:true,
                category,
                message:SUCCESS_MESSAGES.CREATED
              })
        } catch (error) {
            handleErrorResponse(res,error)
        }
   }

   

// ══════════════════════════════════════════════════════════
//  Get All Categories
// ══════════════════════════════════════════════════════════


   async getAllCategories(req:Request,res:Response):Promise<void>{
        try {
          console.log(req.query)
          const {search,page,limit} = req.query
          const {role} = (req as CustomRequest).user 
          console.log(page,limit)
           const pageNumber = Number(page)
           const pageSize = Number(limit)
            const categories = await this._getAllCategoriesUseCase.execute(
              pageNumber,
              pageSize,
              search as string,
              role
            )
             console.log(categories)
            res.status(HTTP_STATUS.OK).json({
                success:true,
                categories,
            })
        } catch (error) {
            handleErrorResponse(res,error)
        }
   }





// ══════════════════════════════════════════════════════════
//  Get Service By Id
// ══════════════════════════════════════════════════════════


    async updateCategoryStatus(req: Request, res: Response): Promise<void> {
      try {
        console.log(req.params)
        const {id} = req.params
        const {status} = req.body
        console.log(id,status)
        const category = await this._updateStatusCategoryUseCase.execute(
          id,
          status
        )
        res.status(HTTP_STATUS.OK).json({
          success:true,
          category,
          message:SUCCESS_MESSAGES.UPDATE_SUCCESS
        })
      } catch (error) {
        handleErrorResponse(res,error)
      }
    }






// ══════════════════════════════════════════════════════════
//  Edit Category
// ══════════════════════════════════════════════════════════


    async editCategory(req:Request,res:Response):Promise<void>{
      try {
        const {id} = req.params
        const {title,description,image} = req.body
        const category = await this._editCategoryUseCase.execute(
          id,
          title,
          description,
          image
        )
        res.status(HTTP_STATUS.OK).json({
          success:true,
          category,
          message:SUCCESS_MESSAGES.UPDATE_SUCCESS
        })
      } catch (error) {
        handleErrorResponse(res,error)
      }
    } 


}