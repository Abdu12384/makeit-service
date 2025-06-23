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
let ServiceController = class ServiceController {
    _addServiceUseCase;
    _getAllServiceUseCase;
    _editServiceUseCase;
    _updateServiceStatusUseCase;
    _getServiceByIdUseCase;
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
    async addService(req, res) {
        try {
            const data = req.body;
            const { userId, role } = req.user;
            if (!userId || role !== "vendor") {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const service = await this._addServiceUseCase.execute({
                ...data,
                vendorId: userId,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                service,
                message: SUCCESS_MESSAGES.ADDED,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Services 
    // ══════════════════════════════════════════════════════════
    async getAllServices(req, res) {
        try {
            const { page, limit, search, sortBy, sortOrder } = req.query;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const customReq = req;
            const user = customReq.user || null;
            const userId = user?.userId;
            const role = user?.role;
            const services = await this._getAllServiceUseCase.execute(pageNumber, pageSize, search, role, userId);
            console.log('services', services);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                services,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Edit Service
    // ══════════════════════════════════════════════════════════
    async editService(req, res) {
        try {
            const { serviceId } = req.params;
            const data = req.body;
            const { userId, role } = req.user;
            if (!userId || role !== "vendor") {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const service = await this._editServiceUseCase.execute(serviceId, data);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                service,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Update Service Status
    // ══════════════════════════════════════════════════════════
    async updateServiceStatus(req, res) {
        try {
            const { serviceId } = req.params;
            const data = req.body;
            const { userId, role } = req.user;
            if (!userId || role !== "vendor") {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const service = await this._updateServiceStatusUseCase.execute(serviceId, data);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                service,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Block Service
    // ══════════════════════════════════════════════════════════
    async blockService(req, res) {
        try {
            const { serviceId } = req.params;
            const { userId, role } = req.user;
            if (!userId || role !== "vendor") {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                });
                return;
            }
            const service = await this._updateServiceStatusUseCase.blockService(serviceId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                service,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get Service By Id
    // ══════════════════════════════════════════════════════════
    async getServiceById(req, res) {
        try {
            const { serviceId } = req.params;
            const service = await this._getServiceByIdUseCase.execute(serviceId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                service,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
ServiceController = __decorate([
    injectable(),
    __param(0, inject("IAddServiceUseCase")),
    __param(1, inject("IGetAllServicesUseCase")),
    __param(2, inject("IEditServiceUseCase")),
    __param(3, inject("IUpdateServiceStatusUseCase")),
    __param(4, inject("IGetServiceByIdUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], ServiceController);
export { ServiceController };
//# sourceMappingURL=service.controller.js.map