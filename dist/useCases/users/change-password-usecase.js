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
let ChangePasswordUseCase = class ChangePasswordUseCase {
    _clientRepository;
    _vendorRepository;
    _passwordHasher;
    constructor(_clientRepository, _vendorRepository, _passwordHasher) {
        this._clientRepository = _clientRepository;
        this._vendorRepository = _vendorRepository;
        this._passwordHasher = _passwordHasher;
    }
    async execute(userId, currentPassword, newPassword, role) {
        console.log('userId', userId);
        let repo;
        let idField;
        if (role === "client") {
            repo = this._clientRepository;
            idField = "clientId";
        }
        else if (role === "vendor") {
            repo = this._vendorRepository;
            idField = "vendorId";
        }
        else {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST);
        }
        const user = await repo.findOne({ userId });
        console.log('user', user);
        if (!user) {
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
        }
        const isPasswordValid = await this._passwordHasher.compare(currentPassword, user?.password);
        if (!isPasswordValid) {
            throw new CustomError(ERROR_MESSAGES.WRONG_CURRENT_PASSWORD, HTTP_STATUS.BAD_REQUEST);
        }
        if (newPassword === currentPassword) {
            throw new CustomError(ERROR_MESSAGES.PASSWORD_SAME, HTTP_STATUS.BAD_REQUEST);
        }
        const hashedPassword = await this._passwordHasher.hash(newPassword);
        await repo.update({ userId }, { password: hashedPassword });
    }
};
ChangePasswordUseCase = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IVendorRepository")),
    __param(2, inject("IPasswordHasher")),
    __metadata("design:paramtypes", [Object, Object, Object])
], ChangePasswordUseCase);
export { ChangePasswordUseCase };
//# sourceMappingURL=change-password-usecase.js.map