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
let GetAllVendorUseCase = class GetAllVendorUseCase {
    _vendorRepository;
    constructor(_vendorRepository) {
        this._vendorRepository = _vendorRepository;
    }
    async execute(forType, pageNumber, pageSize, searchTerm) {
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
        const { items, total } = await this._vendorRepository.findAll({
            ...filter,
        }, skip, limit);
        const response = {
            vendor: items,
            total: Math.ceil(total / validPageSize)
        };
        return response;
    }
};
GetAllVendorUseCase = __decorate([
    injectable(),
    __param(0, inject("IVendorRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllVendorUseCase);
export { GetAllVendorUseCase };
//# sourceMappingURL=get-all-vendor-usecase.js.map