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
let AddReviewUseCase = class AddReviewUseCase {
    _reviewRepository;
    constructor(_reviewRepository) {
        this._reviewRepository = _reviewRepository;
    }
    async execute(data) {
        const review = await this._reviewRepository.findOne({ targetId: data.targetId });
        // if(review){
        //     throw new CustomError(
        //         ERROR_MESSAGES.REVIEW_ALREADY_EXISTS,
        //         HTTP_STATUS.BAD_REQUEST
        //     )
        // }
        await this._reviewRepository.save(data);
    }
};
AddReviewUseCase = __decorate([
    injectable(),
    __param(0, inject("IReviewRepository")),
    __metadata("design:paramtypes", [Object])
], AddReviewUseCase);
export { AddReviewUseCase };
//# sourceMappingURL=add-review.usecase.js.map