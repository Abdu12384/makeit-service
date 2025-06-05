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
let UserExistenceService = class UserExistenceService {
    _clientRepository;
    _vendorRepository;
    _adminRepository;
    constructor(_clientRepository, _vendorRepository, _adminRepository) {
        this._clientRepository = _clientRepository;
        this._vendorRepository = _vendorRepository;
        this._adminRepository = _adminRepository;
    }
    async findUserByEmail(email) {
        const [client, admin, vendor] = await Promise.all([
            this._clientRepository.findOne({ email }),
            this._adminRepository.findOne({ email }),
            this._vendorRepository.findOne({ email }),
        ]);
        if (client)
            return { exists: true, user: client, role: 'client' };
        if (admin)
            return { exists: true, user: admin, role: 'admin' };
        if (vendor)
            return { exists: true, user: vendor, role: 'vendor' };
        return { exists: false, user: null, role: null };
    }
};
UserExistenceService = __decorate([
    injectable(),
    __param(0, inject('IClientRepository')),
    __param(1, inject('IVendorRepository')),
    __param(2, inject('IAdminRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserExistenceService);
export { UserExistenceService };
//# sourceMappingURL=user-existence.service.js.map