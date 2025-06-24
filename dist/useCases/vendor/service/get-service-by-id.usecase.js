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
exports.GetServiceByIdUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let GetServiceByIdUseCase = class GetServiceByIdUseCase {
    constructor(_serviceRepository, _vendorRepository) {
        this._serviceRepository = _serviceRepository;
        this._vendorRepository = _vendorRepository;
    }
    execute(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = yield this._serviceRepository.findOne({ serviceId });
            console.log('service', service);
            if (service) {
                const vendor = yield this._vendorRepository.findOne({ userId: service.vendorId });
                console.log('vendor', vendor);
                return {
                    service,
                    vendor
                };
            }
            return null;
        });
    }
};
exports.GetServiceByIdUseCase = GetServiceByIdUseCase;
exports.GetServiceByIdUseCase = GetServiceByIdUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IServiceRepository")),
    __param(1, (0, tsyringe_1.inject)("IVendorRepository")),
    __metadata("design:paramtypes", [Object, Object])
], GetServiceByIdUseCase);
//# sourceMappingURL=get-service-by-id.usecase.js.map