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
let VendorCantroller = class VendorCantroller {
    _getAllVendorUseCase;
    _updateVendorStatusUseCase;
    constructor(_getAllVendorUseCase, _updateVendorStatusUseCase) {
        this._getAllVendorUseCase = _getAllVendorUseCase;
        this._updateVendorStatusUseCase = _updateVendorStatusUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //   Get All Vendors
    // ══════════════════════════════════════════════════════════
    async getAllVendors(req, res) {
        try {
            console.log('qury here', req.query);
            const { page = 1, limit = 10, search = "", forType } = req.query;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const forTypeString = typeof forType === "string" ? forType : "non-active";
            const searchTermString = typeof search === "string" ? search : "";
            const { vendor, total } = await this._getAllVendorUseCase.execute(forTypeString, pageNumber, pageSize, searchTermString);
            console.log(vendor, total);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                vendor,
                totalPage: total,
                currentPage: pageNumber
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Update Vendor Status
    // ══════════════════════════════════════════════════════════
    async updateVendorStatus(req, res) {
        try {
            const { vendorId } = req.params;
            const { status, message } = req.body;
            if (!vendorId || !status) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: ERROR_MESSAGES.MISSING_PARAMETERS,
                    success: false
                });
                return;
            }
            const vendor = await this._updateVendorStatusUseCase.execute(vendorId, status, message || "");
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
VendorCantroller = __decorate([
    injectable(),
    __param(0, inject("IGetAllVendorUseCase")),
    __param(1, inject("IUpdateVendorStatusUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], VendorCantroller);
export { VendorCantroller };
//# sourceMappingURL=vendor.controller.js.map