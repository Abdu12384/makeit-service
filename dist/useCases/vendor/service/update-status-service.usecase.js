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
import { CustomError } from "../../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../../shared/constants.js";
let UpdateServiceStatusUseCase = class UpdateServiceStatusUseCase {
    _serviceRepository;
    constructor(_serviceRepository) {
        this._serviceRepository = _serviceRepository;
    }
    async execute(serviceId, status) {
        const service = await this._serviceRepository.findOne({ serviceId });
        if (!service) {
            throw new CustomError("Service not found", HTTP_STATUS.NOT_FOUND);
        }
        service.status = status;
        await this._serviceRepository.update({ serviceId }, service);
    }
};
UpdateServiceStatusUseCase = __decorate([
    injectable(),
    __param(0, inject("IServiceRepository")),
    __metadata("design:paramtypes", [Object])
], UpdateServiceStatusUseCase);
export { UpdateServiceStatusUseCase };
//# sourceMappingURL=update-status-service.usecase.js.map