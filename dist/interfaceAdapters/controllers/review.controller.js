"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
let ReviewController = class ReviewController {
    constructor(_addReviewUseCase, _getAllReviewsUseCase) {
        this._addReviewUseCase = _addReviewUseCase;
        this._getAllReviewsUseCase = _getAllReviewsUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //  Create Review
    // ══════════════════════════════════════════════════════════
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { targetId, targetType, comment, rating } = req.body;
                const { userId } = req.user;
                if (!userId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.MISSING_PARAMETERS, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                const addReview = yield this._addReviewUseCase.execute({
                    targetId,
                    comment,
                    rating,
                    reviewerId: userId,
                    targetType
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.ADDED,
                    review: addReview
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Reviews
    // ══════════════════════════════════════════════════════════
    getAllReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, page, targetId, targetType } = req.query;
                const pageNumber = Number(page);
                const pageSize = Number(limit);
                const reviews = yield this._getAllReviewsUseCase.execute(targetId, targetType, pageNumber, pageSize);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    reviews
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
};
exports.ReviewController = ReviewController;
exports.ReviewController = ReviewController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IAddReviewUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetAllReviewUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], ReviewController);
//# sourceMappingURL=review.controller.js.map