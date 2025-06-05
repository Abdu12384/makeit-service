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
let GetAllCategoryUseCase = class GetAllCategoryUseCase {
    _categoryRepository;
    constructor(_categoryRepository) {
        this._categoryRepository = _categoryRepository;
    }
    async execute(pageNumber, pageSize, search, role) {
        const validPage = Math.max(1, pageNumber || 1);
        const validLimit = Math.max(1, pageSize || 10);
        const skip = (validPage - 1) * validLimit;
        console.log(validPage, validLimit, skip);
        const filter = {};
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }
        if (role === "vendor") {
            filter.status = "active";
        }
        const sort = { createdAt: -1 };
        const { total, items } = await this._categoryRepository.findAll(filter, skip, validLimit, sort);
        return {
            total: Math.ceil(total / validLimit),
            items,
        };
    }
};
GetAllCategoryUseCase = __decorate([
    injectable(),
    __param(0, inject("ICategoryRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllCategoryUseCase);
export { GetAllCategoryUseCase };
//# sourceMappingURL=get-all-category-usecase.js.map