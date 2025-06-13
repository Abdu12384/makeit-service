import { inject, injectable } from "tsyringe";
import { IReviewController } from "../../domain/interface/controllerInterfaces/review/review-controller.interface.js";
import { Request, Response } from "express";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { IAddReviewUseCase } from "../../domain/interface/useCaseInterface/review/add-review-usecase.interface.js";
import { IGetAllReviewUseCase } from "../../domain/interface/useCaseInterface/review/get-all-review-usecase.interface.js";







@injectable()
export class ReviewController implements IReviewController {
    
    constructor(
      @inject("IAddReviewUseCase")
      private _addReviewUseCase: IAddReviewUseCase,

      @inject("IGetAllReviewUseCase")
      private _getAllReviewsUseCase: IGetAllReviewUseCase,
    ){}




// ══════════════════════════════════════════════════════════
//  Create Review
// ══════════════════════════════════════════════════════════
    async createReview(req: Request, res: Response): Promise<void> {
        try {
            const {targetId,targetType,comment,rating} = req.body
            console.log(req.body)
            const {userId} = (req as CustomRequest).user
            if(!userId){
                throw new CustomError(
                    ERROR_MESSAGES.MISSING_PARAMETERS,
                    HTTP_STATUS.BAD_REQUEST
                )
            }

           const addReview = await this._addReviewUseCase.execute({
            targetId,
            comment,
            rating,
            reviewerId:userId,
            targetType
           })
           res.status(HTTP_STATUS.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.ADDED,
            review: addReview
           })
            
        } catch (error) {
            handleErrorResponse(res,error)
        }
    }


// ══════════════════════════════════════════════════════════
//  Get All Reviews
// ══════════════════════════════════════════════════════════
    async getAllReviews(req: Request, res: Response): Promise<void> {
        try {
            const { limit,page,targetId,targetType } = req.query
             const pageNumber = Number(page)
             const pageSize = Number(limit)
            const reviews = await this._getAllReviewsUseCase.execute(
              targetId as string,
              targetType as string,
              pageNumber,
              pageSize
            )
            res.status(HTTP_STATUS.OK).json({
                success: true,
                reviews
            })
        } catch (error) {
            handleErrorResponse(res,error)
        }
    }

    
}