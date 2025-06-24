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
exports.ForgotPasswordUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
const config_1 = require("../../shared/config");
let ForgotPasswordUseCase = class ForgotPasswordUseCase {
    constructor(_userExitenceService, _generateTokenUseCase, _emailService) {
        this._userExitenceService = _userExitenceService;
        this._generateTokenUseCase = _generateTokenUseCase;
        this._emailService = _emailService;
    }
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const { exists, user } = yield this._userExitenceService.findUserByEmail(email);
            if (!exists || !user) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const token = yield this._generateTokenUseCase.execute(user.userId, user.email, user.role);
            console.log('token', token);
            const resetLink = `${config_1.config.ORIGIN}/reset-password?token=${token.accessToken}`;
            const subject = "Reset Password";
            const content = (0, constants_1.RESET_PASSWORD_MAIL_CONTENT)(resetLink);
            yield this._emailService.sendCustomEmail(email, subject, content);
        });
    }
};
exports.ForgotPasswordUseCase = ForgotPasswordUseCase;
exports.ForgotPasswordUseCase = ForgotPasswordUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IUserExistenceService")),
    __param(1, (0, tsyringe_1.inject)("IGenerateTokenUseCase")),
    __param(2, (0, tsyringe_1.inject)("IEmailService")),
    __metadata("design:paramtypes", [Object, Object, Object])
], ForgotPasswordUseCase);
//# sourceMappingURL=forgot-password.usecase.js.map