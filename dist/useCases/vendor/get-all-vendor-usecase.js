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
exports.GetAllVendorUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const class_transformer_1 = require("class-transformer");
const vendor_dto_1 = require("../../shared/dtos/vendor.dto");
let GetAllVendorUseCase = class GetAllVendorUseCase {
    constructor(_vendorRepository) {
        this._vendorRepository = _vendorRepository;
    }
    execute(forType, pageNumber, pageSize, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (searchTerm) {
                filter.$or = [
                    { name: { $regex: searchTerm, $options: "i" } },
                    { email: { $regex: searchTerm, $options: "i" } }
                ];
            }
            filter.vendorStatus = { $ne: "approved" };
            const validPageNumber = Math.max(1, pageNumber || 1);
            const validPageSize = Math.max(1, pageSize || 10);
            const skip = (validPageNumber - 1) * validPageNumber;
            const limit = validPageSize;
            const { items, total } = yield this._vendorRepository.findAll(Object.assign({}, filter), skip, limit);
            const vendors = (0, class_transformer_1.plainToInstance)(vendor_dto_1.VendorDTO, items, { excludeExtraneousValues: true });
            const response = {
                vendor: vendors,
                total: Math.ceil(total / validPageSize)
            };
            return response;
        });
    }
};
exports.GetAllVendorUseCase = GetAllVendorUseCase;
exports.GetAllVendorUseCase = GetAllVendorUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IVendorRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllVendorUseCase);
//# sourceMappingURL=get-all-vendor-usecase.js.map