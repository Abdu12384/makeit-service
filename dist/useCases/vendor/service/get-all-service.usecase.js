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
let GetAllServiceUseCase = class GetAllServiceUseCase {
    _serviceRepository;
    constructor(_serviceRepository) {
        this._serviceRepository = _serviceRepository;
    }
    async execute(pageNumber, pageSize, search, sortBy, sortOrder, vendorId) {
        const validPageNumber = Math.max(1, pageNumber || 1);
        const validPageSize = Math.max(1, pageSize || 10);
        const skip = (validPageNumber - 1) * validPageSize;
        const filter = {};
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }
        if (vendorId) {
            filter.vendorId = vendorId;
        }
        const limit = validPageSize;
        const sort = { createdAt: -1 };
        const { items, total } = await this._serviceRepository.findAllWithPopulate(filter, skip, limit, sort);
        const response = {
            services: items,
            total: Math.ceil(total / validPageSize)
        };
        return response;
    }
};
GetAllServiceUseCase = __decorate([
    injectable(),
    __param(0, inject("IServiceRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllServiceUseCase);
export { GetAllServiceUseCase };
//# sourceMappingURL=get-all-service.usecase.js.map