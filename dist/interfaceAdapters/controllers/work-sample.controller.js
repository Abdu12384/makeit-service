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
exports.WorkSampleController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const error_handler_1 = require("../../shared/utils/error.handler");
let WorkSampleController = class WorkSampleController {
    constructor(_addWorkSampleUseCase, _updateWorkSampleUseCase, _getAllWorkSamplesUseCase) {
        this._addWorkSampleUseCase = _addWorkSampleUseCase;
        this._updateWorkSampleUseCase = _updateWorkSampleUseCase;
        this._getAllWorkSamplesUseCase = _getAllWorkSamplesUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //   Get All Work Sample
    // ══════════════════════════════════════════════════════════
    getAllWorkSamplesByVendorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const workSamples = yield this._getAllWorkSamplesUseCase.execute(providerId, pageNumber, pageSize);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    workSamples,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //   Create Work Sample
    // ══════════════════════════════════════════════════════════
    createWorkSample(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, images, } = req.body;
                const { userId, role } = req.user;
                if (!userId || role !== "vendor") {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._addWorkSampleUseCase.execute({
                    title,
                    description,
                    images,
                    vendorId: userId
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.CREATED
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //   Update Work Sample
    // ══════════════════════════════════════════════════════════
    updateWorkSample(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { workSampleId } = req.params;
                const { title, description, images, } = req.body;
                const { userId, role } = req.user;
                if (!userId || role !== "vendor") {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                yield this._updateWorkSampleUseCase.execute(workSampleId, {
                    title,
                    description,
                    images,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.WorkSampleController = WorkSampleController;
exports.WorkSampleController = WorkSampleController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IAddWorkSampleUseCase")),
    __param(1, (0, tsyringe_1.inject)("IUpdateWorkSampleUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetAllWorkSampleByIdUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object])
], WorkSampleController);
//# sourceMappingURL=work-sample.controller.js.map