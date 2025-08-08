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
exports.LoginUserUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
const client_dto_1 = require("../../shared/dtos/client.dto");
const class_transformer_1 = require("class-transformer");
let LoginUserUseCase = class LoginUserUseCase {
    constructor(_clientRepository, _vendorRepository, _adminRepository, _passwordBcrypt) {
        this._clientRepository = _clientRepository;
        this._vendorRepository = _vendorRepository;
        this._adminRepository = _adminRepository;
        this._passwordBcrypt = _passwordBcrypt;
    }
    execute(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let repository;
            if (user.role === 'client') {
                repository = this._clientRepository;
            }
            else if (user.role === 'vendor') {
                repository = this._vendorRepository;
            }
            else if (user.role === 'admin') {
                repository = this._adminRepository;
            }
            else {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_ROLE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            if (!user.email || !user.password) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const userData = yield repository.findOne({ email: user.email });
            if (!userData) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (userData.status === "pending") {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.ACCOUNT_UNDER_VERIFICATION, constants_1.HTTP_STATUS.FORBIDDEN);
            }
            if (userData.status !== "active") {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BLOCKED, constants_1.HTTP_STATUS.FORBIDDEN);
            }
            if (user.password) {
                const isPasswordMatch = yield this._passwordBcrypt.compare(user.password, userData.password);
                if (!isPasswordMatch) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS, constants_1.HTTP_STATUS.FORBIDDEN);
                }
            }
            const users = (0, class_transformer_1.plainToInstance)(client_dto_1.UserDto, userData, { excludeExtraneousValues: true });
            console.log(users);
            return users;
        });
    }
};
exports.LoginUserUseCase = LoginUserUseCase;
exports.LoginUserUseCase = LoginUserUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IClientRepository")),
    __param(1, (0, tsyringe_1.inject)("IVendorRepository")),
    __param(2, (0, tsyringe_1.inject)("IAdminRepository")),
    __param(3, (0, tsyringe_1.inject)("IPasswordHasher")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], LoginUserUseCase);
//# sourceMappingURL=login-user.usecase.js.map