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
exports.ServiceController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const error_handler_1 = require("../../shared/utils/error.handler");
let ServiceController = class ServiceController {
    constructor(_addServiceUseCase, _getAllServiceUseCase, _editServiceUseCase, _updateServiceStatusUseCase, _getServiceByIdUseCase) {
        this._addServiceUseCase = _addServiceUseCase;
        this._getAllServiceUseCase = _getAllServiceUseCase;
        this._editServiceUseCase = _editServiceUseCase;
        this._updateServiceStatusUseCase = _updateServiceStatusUseCase;
        this._getServiceByIdUseCase = _getServiceByIdUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //  Add Service
    // ══════════════════════════════════════════════════════════
    addService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { userId, role } = req.user;
                if (!userId || role !== "vendor") {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const service = yield this._addServiceUseCase.execute(Object.assign(Object.assign({}, data), { vendorId: userId }));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    service,
                    message: constants_1.SUCCESS_MESSAGES.ADDED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Services 
    // ══════════════════════════════════════════════════════════
    getAllServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, search } = req.query;
                const pageNumber = Number(page);
                const pageSize = Number(limit);
                const customReq = req;
                const user = customReq.user || null;
                const userId = user === null || user === void 0 ? void 0 : user.userId;
                const role = user === null || user === void 0 ? void 0 : user.role;
                const services = yield this._getAllServiceUseCase.execute(pageNumber, pageSize, search, role, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    services,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Edit Service
    // ══════════════════════════════════════════════════════════
    editService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceId } = req.params;
                const data = req.body;
                const { userId, role } = req.user;
                if (!userId || role !== "vendor") {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const service = yield this._editServiceUseCase.execute(serviceId, data);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    service,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Update Service Status
    // ══════════════════════════════════════════════════════════
    updateServiceStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceId } = req.params;
                const data = req.body;
                const { userId, role } = req.user;
                if (!userId || role !== "vendor") {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const service = yield this._updateServiceStatusUseCase.execute(serviceId, data);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    service,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Block Service
    // ══════════════════════════════════════════════════════════
    blockService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceId } = req.params;
                const { userId, role } = req.user;
                if (!userId || role !== "vendor") {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                    });
                    return;
                }
                const service = yield this._updateServiceStatusUseCase.blockService(serviceId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    service,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Get Service By Id
    // ══════════════════════════════════════════════════════════
    getServiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceId } = req.params;
                const service = yield this._getServiceByIdUseCase.execute(serviceId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    service,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.ServiceController = ServiceController;
exports.ServiceController = ServiceController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IAddServiceUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetAllServicesUseCase")),
    __param(2, (0, tsyringe_1.inject)("IEditServiceUseCase")),
    __param(3, (0, tsyringe_1.inject)("IUpdateServiceStatusUseCase")),
    __param(4, (0, tsyringe_1.inject)("IGetServiceByIdUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], ServiceController);
//# sourceMappingURL=service.controller.js.map