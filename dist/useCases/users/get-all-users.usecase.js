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
import { CustomError } from "../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
let GetAllUserUseCase = class GetAllUserUseCase {
    _clientRepository;
    _vendorRepository;
    constructor(_clientRepository, _vendorRepository) {
        this._clientRepository = _clientRepository;
        this._vendorRepository = _vendorRepository;
    }
    async execute(userType, pageNumber, pageSize, searchTerm) {
        let filter = {};
        if (userType) {
            filter.role = userType;
        }
        console.log('userType', userType);
        if (searchTerm) {
            filter.$or = [
                { name: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } }
            ];
        }
        let repo;
        if (userType === "client") {
            repo = this._clientRepository;
        }
        else if (userType === "vendor") {
            repo = this._vendorRepository;
            filter.vendorStatus = "approved";
        }
        else {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST);
        }
        const validPageNumber = Math.max(1, pageNumber || 1);
        const validPageSize = Math.max(1, pageSize || 10);
        const skip = (validPageNumber - 1) * validPageSize;
        const limit = validPageSize;
        const sort = { createdAt: -1 };
        const { items, total } = await repo.findAll(filter, skip, limit, sort);
        const response = {
            users: items,
            total: Math.ceil(total / validPageSize)
        };
        return response;
    }
};
GetAllUserUseCase = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IVendorRepository")),
    __metadata("design:paramtypes", [Object, Object])
], GetAllUserUseCase);
export { GetAllUserUseCase };
//# sourceMappingURL=get-all-users.usecase.js.map