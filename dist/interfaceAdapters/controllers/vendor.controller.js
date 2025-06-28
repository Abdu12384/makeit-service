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
exports.VendorCantroller = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const error_handler_1 = require("../../shared/utils/error.handler");
let VendorCantroller = class VendorCantroller {
    constructor(_getAllVendorUseCase, _updateVendorStatusUseCase) {
        this._getAllVendorUseCase = _getAllVendorUseCase;
        this._updateVendorStatusUseCase = _updateVendorStatusUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //   Get All Vendors
    // ══════════════════════════════════════════════════════════
    getAllVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = "", forType } = req.query;
                const pageNumber = Number(page);
                const pageSize = Number(limit);
                const forTypeString = typeof forType === "string" ? forType : "non-active";
                const searchTermString = typeof search === "string" ? search : "";
                const { vendor, total } = yield this._getAllVendorUseCase.execute(forTypeString, pageNumber, pageSize, searchTermString);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    vendor,
                    totalPage: total,
                    currentPage: pageNumber
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Update Vendor Status
    // ══════════════════════════════════════════════════════════
    updateVendorStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params;
                const { status, message } = req.body;
                if (!vendorId || !status) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        message: constants_1.ERROR_MESSAGES.MISSING_PARAMETERS,
                        success: false
                    });
                    return;
                }
                const vendor = yield this._updateVendorStatusUseCase.execute(vendorId, status, message || "");
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
};
exports.VendorCantroller = VendorCantroller;
exports.VendorCantroller = VendorCantroller = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetAllVendorUseCase")),
    __param(1, (0, tsyringe_1.inject)("IUpdateVendorStatusUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], VendorCantroller);
//# sourceMappingURL=vendor.controller.js.map