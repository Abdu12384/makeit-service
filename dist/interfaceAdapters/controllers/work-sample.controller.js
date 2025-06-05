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
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
let WorkSampleController = class WorkSampleController {
    _addWorkSampleUseCase;
    _updateWorkSampleUseCase;
    _getAllWorkSamplesUseCase;
    constructor(_addWorkSampleUseCase, _updateWorkSampleUseCase, _getAllWorkSamplesUseCase) {
        this._addWorkSampleUseCase = _addWorkSampleUseCase;
        this._updateWorkSampleUseCase = _updateWorkSampleUseCase;
        this._getAllWorkSamplesUseCase = _getAllWorkSamplesUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //   Get All Work Sample
    // ══════════════════════════════════════════════════════════
    async getAllWorkSamplesByVendorId(req, res) {
        try {
            const { page, limit } = req.query;
            const { vendorId } = req.params;
            const { userId, role } = req.user;
            const pageNumber = Number(page) || 1;
            const pageSize = Number(limit) || 10;
            let providerId = vendorId;
            if (role === "client") {
                providerId = vendorId;
            }
            else {
                providerId = userId;
            }
            const workSamples = await this._getAllWorkSamplesUseCase.execute(providerId, pageNumber, pageSize);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                workSamples,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //   Create Work Sample
    // ══════════════════════════════════════════════════════════
    async createWorkSample(req, res) {
        try {
            const { title, description, images, } = req.body;
            const { userId, role } = req.user;
            if (!userId || role !== "vendor") {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const workSample = await this._addWorkSampleUseCase.execute({
                title,
                description,
                images,
                vendorId: userId
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CREATED
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //   Update Work Sample
    // ══════════════════════════════════════════════════════════
    async updateWorkSample(req, res) {
        try {
            const { workSampleId } = req.params;
            const { title, description, images, } = req.body;
            const { userId, role } = req.user;
            if (!userId || role !== "vendor") {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const workSample = await this._updateWorkSampleUseCase.execute(workSampleId, {
                title,
                description,
                images,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
WorkSampleController = __decorate([
    injectable(),
    __param(0, inject("IAddWorkSampleUseCase")),
    __param(1, inject("IUpdateWorkSampleUseCase")),
    __param(2, inject("IGetAllWorkSampleByIdUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object])
], WorkSampleController);
export { WorkSampleController };
//# sourceMappingURL=work-sample.controller.js.map