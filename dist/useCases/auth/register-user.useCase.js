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
import { injectable, inject } from "tsyringe";
import { CustomError } from "../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
let RegisterClientUseCase = class RegisterClientUseCase {
    _clientRepository;
    _emailExistenService;
    _passwordHasher;
    _vendorRepository;
    constructor(_clientRepository, _emailExistenService, _passwordHasher, _vendorRepository) {
        this._clientRepository = _clientRepository;
        this._emailExistenService = _emailExistenService;
        this._passwordHasher = _passwordHasher;
        this._vendorRepository = _vendorRepository;
    }
    async createUsers(user) {
        console.log('useCase', user);
        const { role, email, password } = user;
        const { exists } = await this._emailExistenService.findUserByEmail(email);
        if (exists) {
            throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
        }
        const hashedPassword = password
            ? await this._passwordHasher.hash(password)
            : null;
        const userId = generateUniqueId(role);
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
        return await repository.save({
            ...user,
            password: hashedPassword ?? "",
            userId: userId
        });
    }
};
RegisterClientUseCase = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IUserExistenceService")),
    __param(2, inject("IPasswordHasher")),
    __param(3, inject("IVendorRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], RegisterClientUseCase);
export { RegisterClientUseCase };
//# sourceMappingURL=register-user.useCase.js.map