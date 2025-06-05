var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
let ReviewController = class ReviewController {
    _addReviewUseCase;
    _getAllReviewsUseCase;
    constructor(_addReviewUseCase, _getAllReviewsUseCase) {
        this._addReviewUseCase = _addReviewUseCase;
        this._getAllReviewsUseCase = _getAllReviewsUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //  Create Review
    // ══════════════════════════════════════════════════════════
    async createReview(req, res) {
        try {
            const { targetId, targetType, comment, rating } = req.body;
            console.log(req.body);
            const { userId } = req.user;
            if (!userId) {
                throw new CustomError(ERROR_MESSAGES.MISSING_PARAMETERS, HTTP_STATUS.BAD_REQUEST);
            }
            const addReview = await this._addReviewUseCase.execute({
                targetId,
                comment,
                rating,
                reviewerId: userId,
                targetType
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.ADDED,
                review: addReview
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Reviews
    // ══════════════════════════════════════════════════════════
    async getAllReviews(req, res) {
        try {
            const { limit, page, targetId, targetType } = req.query;
            console.log('query', req.query);
            console.log('body', req.body);
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const reviews = await this._getAllReviewsUseCase.execute(targetId, targetType, pageNumber, pageSize);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                reviews
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
ReviewController = __decorate([
    injectable(),
    __param(0, inject("IAddReviewUseCase")),
    __param(1, inject("IGetAllReviewUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], ReviewController);
export { ReviewController };
//# sourceMappingURL=review.controller.js.map