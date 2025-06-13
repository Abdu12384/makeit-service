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
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
let CategoryController = class CategoryController {
    _createCategoryUseCase;
    _getAllCategoriesUseCase;
    _updateStatusCategoryUseCase;
    _editCategoryUseCase;
    constructor(_createCategoryUseCase, _getAllCategoriesUseCase, _updateStatusCategoryUseCase, _editCategoryUseCase) {
        this._createCategoryUseCase = _createCategoryUseCase;
        this._getAllCategoriesUseCase = _getAllCategoriesUseCase;
        this._updateStatusCategoryUseCase = _updateStatusCategoryUseCase;
        this._editCategoryUseCase = _editCategoryUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //  Create Category
    // ══════════════════════════════════════════════════════════
    async createCategory(req, res) {
        try {
            const data = req.body;
            const category = await this._createCategoryUseCase.execute(data);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                category,
                message: SUCCESS_MESSAGES.CREATED
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Categories
    // ══════════════════════════════════════════════════════════
    async getAllCategories(req, res) {
        try {
            console.log(req.query);
            const { search, page, limit } = req.query;
            const { role } = req.user;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const categories = await this._getAllCategoriesUseCase.execute(pageNumber, pageSize, search, role);
            console.log(categories);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                categories,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get Service By Id
    // ══════════════════════════════════════════════════════════
    async updateCategoryStatus(req, res) {
        try {
            console.log(req.params);
            const { id } = req.params;
            const { status } = req.body;
            const category = await this._updateStatusCategoryUseCase.execute(id, status);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                category,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Edit Category
    // ══════════════════════════════════════════════════════════
    async editCategory(req, res) {
        try {
            const { id } = req.params;
            const { title, description, image } = req.body;
            const category = await this._editCategoryUseCase.execute(id, title, description, image);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                category,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
CategoryController = __decorate([
    injectable(),
    __param(0, inject("ICategoryUseCase")),
    __param(1, inject("IGetCategoryUseCase")),
    __param(2, inject("IUpdateStatusCategoryUseCase")),
    __param(3, inject("IEditCategoryUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CategoryController);
export { CategoryController };
//# sourceMappingURL=category.controller.js.map