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
let ResetPasswordUseCase = class ResetPasswordUseCase {
    _jwtService;
    _clientRepository;
    _vendorRepository;
    _passwordHasher;
    constructor(_jwtService, _clientRepository, _vendorRepository, _passwordHasher) {
        this._jwtService = _jwtService;
        this._clientRepository = _clientRepository;
        this._vendorRepository = _vendorRepository;
        this._passwordHasher = _passwordHasher;
    }
    async execute(token, password) {
        const varifyToken = await this._jwtService.verifyAccessToken(token);
        if (!varifyToken) {
            throw new CustomError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
        }
        const { userId, role } = varifyToken;
        let repository;
        if (role === "client") {
            repository = this._clientRepository;
        }
        else if (role === 'vendor') {
            repository = this._vendorRepository;
        }
        else {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST);
        }
        const hashedPassword = await this._passwordHasher.hash(password);
        const isPasswordSame = await this._passwordHasher.compare(password, hashedPassword);
        if (isPasswordSame) {
            throw new CustomError(ERROR_MESSAGES.PASSWORD_SAME, HTTP_STATUS.BAD_REQUEST);
        }
        const user = await repository.update({ userId }, { password: hashedPassword });
        console.log('user', user);
        if (!user) {
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
    }
};
ResetPasswordUseCase = __decorate([
    injectable(),
    __param(0, inject("ITokenService")),
    __param(1, inject("IClientRepository")),
    __param(2, inject("IVendorRepository")),
    __param(3, inject("IPasswordHasher")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ResetPasswordUseCase);
export { ResetPasswordUseCase };
//# sourceMappingURL=reset-password.usecase.js.map