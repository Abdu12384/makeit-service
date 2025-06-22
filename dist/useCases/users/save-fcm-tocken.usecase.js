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
let SaveFCMTokenUseCase = class SaveFCMTokenUseCase {
    _clientRepository;
    _vendorRepository;
    constructor(_clientRepository, _vendorRepository) {
        this._clientRepository = _clientRepository;
        this._vendorRepository = _vendorRepository;
    }
    async execute(userId, token, role) {
        if (role === "client") {
            await this._clientRepository.updateFcmToken(userId, token);
        }
        if (role === "vendor") {
            await this._vendorRepository.updateFcmToken(userId, token);
        }
    }
};
SaveFCMTokenUseCase = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IVendorRepository")),
    __metadata("design:paramtypes", [Object, Object])
], SaveFCMTokenUseCase);
export { SaveFCMTokenUseCase };
//# sourceMappingURL=save-fcm-tocken.usecase.js.map