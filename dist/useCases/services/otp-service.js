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
let OtpService = class OtpService {
    otpRepository;
    constructor(otpRepository) {
        this.otpRepository = otpRepository;
    }
    // =================== Genarate OTP =====================//  
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    // ===================== Save OTP ===========================//
    async storeOtp(email, otp) {
        console.log('storing otp');
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 2);
        await this.otpRepository.deleteOtp(email);
        await this.otpRepository.saveOtp({
            email,
            otp,
            expiresAt
        });
    }
    //======================= Varify OTP =========================//
    async varifyOtp(email, otp) {
        const savedOtp = await this.otpRepository.findOtpByEmail(email);
        if (!savedOtp) {
            return false;
        }
        const isOtpValid = savedOtp.otp === otp;
        const isExpired = new Date() > new Date(savedOtp.expiresAt);
        return isOtpValid && !isExpired;
    }
};
OtpService = __decorate([
    injectable(),
    __param(0, inject("IOtpRepositroy")),
    __metadata("design:paramtypes", [Object])
], OtpService);
export { OtpService };
//# sourceMappingURL=otp-service.js.map