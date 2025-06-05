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
let GetServiceByIdUseCase = class GetServiceByIdUseCase {
    _serviceRepository;
    _vendorRepository;
    constructor(_serviceRepository, _vendorRepository) {
        this._serviceRepository = _serviceRepository;
        this._vendorRepository = _vendorRepository;
    }
    async execute(serviceId) {
        const service = await this._serviceRepository.findOne({ serviceId });
        console.log('service', service);
        if (service) {
            const vendor = await this._vendorRepository.findOne({ userId: service.vendorId });
            console.log('vendor', vendor);
            return {
                service,
                vendor
            };
        }
    }
};
GetServiceByIdUseCase = __decorate([
    injectable(),
    __param(0, inject("IServiceRepository")),
    __param(1, inject("IVendorRepository")),
    __metadata("design:paramtypes", [Object, Object])
], GetServiceByIdUseCase);
export { GetServiceByIdUseCase };
//# sourceMappingURL=get-service-by-id.usecase.js.map