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
let sendOtpEmailUseCase = class sendOtpEmailUseCase {
    _otpService;
    _emailService;
    _userExitenceService;
    constructor(_otpService, _emailService, _userExitenceService) {
        this._otpService = _otpService;
        this._emailService = _emailService;
        this._userExitenceService = _userExitenceService;
    }
    async execute(email) {
        console.log(email);
        const { exists } = await this._userExitenceService.findUserByEmail(email);
        console.log('inthe db', exists);
        if (exists) {
            throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
        }
        const otp = this._otpService.generateOtp();
        console.log(`Generated OTP : ${otp}`);
        await this._otpService.storeOtp(email, otp);
        await this._emailService.sendOtpEmail(email, "MAKEIT - Verify Your Email", otp);
        console.log(`OTP sent to : ${email}`);
    }
};
sendOtpEmailUseCase = __decorate([
    injectable(),
    __param(0, inject("IOtpService")),
    __param(1, inject("IEmailService")),
    __param(2, inject("IUserExistenceService")),
    __metadata("design:paramtypes", [Object, Object, Object])
], sendOtpEmailUseCase);
export { sendOtpEmailUseCase };
//# sourceMappingURL=send-otp-email.usecase.js.map