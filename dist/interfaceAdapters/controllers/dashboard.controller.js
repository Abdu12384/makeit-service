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
import { HTTP_STATUS } from "../../shared/constants.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
let DashboardController = class DashboardController {
    _getAllDashboardDataUseCase;
    constructor(_getAllDashboardDataUseCase) {
        this._getAllDashboardDataUseCase = _getAllDashboardDataUseCase;
    }
    async getAllDashboardData(req, res) {
        const { role, userId } = req.user;
        const { period } = req.query;
        try {
            const data = await this._getAllDashboardDataUseCase.execute(role, userId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
DashboardController = __decorate([
    injectable(),
    __param(0, inject("IGetAllDashboardDataUseCase")),
    __metadata("design:paramtypes", [Object])
], DashboardController);
export default DashboardController;
//# sourceMappingURL=dashboard.controller.js.map