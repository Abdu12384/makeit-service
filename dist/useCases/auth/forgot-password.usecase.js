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
import { ERROR_MESSAGES, HTTP_STATUS, RESET_PASSWORD_MAIL_CONTENT } from "../../shared/constants.js";
import { config } from "../../shared/config.js";
let ForgotPasswordUseCase = class ForgotPasswordUseCase {
    _userExitenceService;
    _generateTokenUseCase;
    _emailService;
    constructor(_userExitenceService, _generateTokenUseCase, _emailService) {
        this._userExitenceService = _userExitenceService;
        this._generateTokenUseCase = _generateTokenUseCase;
        this._emailService = _emailService;
    }
    async execute(email) {
        const { exists, user } = await this._userExitenceService.findUserByEmail(email);
        if (!exists || !user) {
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        const token = await this._generateTokenUseCase.execute(user.userId, user.email, user.role);
        console.log('token', token);
        const resetLink = `${config.ORIGIN}/reset-password?token=${token.accessToken}`;
        const subject = "Reset Password";
        const content = RESET_PASSWORD_MAIL_CONTENT(resetLink);
        await this._emailService.sendCustomEmail(email, subject, content);
    }
};
ForgotPasswordUseCase = __decorate([
    injectable(),
    __param(0, inject("IUserExistenceService")),
    __param(1, inject("IGenerateTokenUseCase")),
    __param(2, inject("IEmailService")),
    __metadata("design:paramtypes", [Object, Object, Object])
], ForgotPasswordUseCase);
export { ForgotPasswordUseCase };
//# sourceMappingURL=forgot-password.usecase.js.map