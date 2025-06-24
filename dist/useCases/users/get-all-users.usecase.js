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
exports.GetAllUserUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
let GetAllUserUseCase = class GetAllUserUseCase {
    constructor(_clientRepository, _vendorRepository) {
        this._clientRepository = _clientRepository;
        this._vendorRepository = _vendorRepository;
    }
    execute(userType, pageNumber, pageSize, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
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
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_ROLE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const validPageNumber = Math.max(1, pageNumber || 1);
            const validPageSize = Math.max(1, pageSize || 10);
            const skip = (validPageNumber - 1) * validPageSize;
            const limit = validPageSize;
            const sort = { createdAt: -1 };
            const { items, total } = yield repo.findAll(filter, skip, limit, sort);
            const response = {
                users: items,
                total: Math.ceil(total / validPageSize)
            };
            return response;
        });
    }
};
exports.GetAllUserUseCase = GetAllUserUseCase;
exports.GetAllUserUseCase = GetAllUserUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IClientRepository")),
    __param(1, (0, tsyringe_1.inject)("IVendorRepository")),
    __metadata("design:paramtypes", [Object, Object])
], GetAllUserUseCase);
//# sourceMappingURL=get-all-users.usecase.js.map