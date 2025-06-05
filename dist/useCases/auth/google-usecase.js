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
import { OAuth2Client } from "google-auth-library";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { CustomError } from "../../domain/utils/custom.error.js";
import { SendEmailUseCase } from "../common/send-email.usecase.js";
let GoogleUseCase = class GoogleUseCase {
    _registerUserUseCase;
    _clientRepository;
    _vendorRepository;
    _sendEmailUsecCase;
    _oAuthClient;
    constructor(_registerUserUseCase, _clientRepository, _vendorRepository, _sendEmailUsecCase) {
        this._registerUserUseCase = _registerUserUseCase;
        this._clientRepository = _clientRepository;
        this._vendorRepository = _vendorRepository;
        this._sendEmailUsecCase = _sendEmailUsecCase;
        this._oAuthClient = new OAuth2Client();
    }
    async execute(credential, client_id, role) {
        const ticket = await this._oAuthClient.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new CustomError("Invalid or empty token payload", HTTP_STATUS.UNAUTHORIZED);
        }
        const googleId = payload.sub;
        const email = payload.email;
        const profileImage = payload.picture || "";
        const name = payload.given_name || payload.family_name || "";
        if (!email) {
            throw new CustomError("Email is required", HTTP_STATUS.BAD_REQUEST);
        }
        let repository;
        if (role === 'client') {
            repository = this._clientRepository;
        }
        else if (role === 'vendor') {
            repository = this._vendorRepository;
        }
        else {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST);
        }
        const existingUser = await repository.findOne({ email });
        if (existingUser) {
            if (existingUser.status !== "active") {
                throw new CustomError(ERROR_MESSAGES.BLOCKED, HTTP_STATUS.FORBIDDEN);
            }
            return existingUser;
        }
        if (role === "vendor") {
            throw new CustomError("Vendor accounts cannot be created using Google. Pleas Register First", HTTP_STATUS.FORBIDDEN);
        }
        const userData = {
            name,
            role,
            email,
            phone: "",
            password: "",
            googleId,
            profileImage,
            googleVarified: true
        };
        const newUser = await this._registerUserUseCase.createUsers(userData);
        if (!newUser) {
            throw new CustomError("Registration failed", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        this._sendEmailUsecCase.execute(email, "Welcom to MakeIT! Your Google Registration is Complete 🎉", 'welcom MakeIT');
        return newUser;
    }
};
GoogleUseCase = __decorate([
    injectable(),
    __param(0, inject("IClientRegisterUseCase")),
    __param(1, inject("IClientRepository")),
    __param(2, inject("IVendorRepository")),
    __param(3, inject("ISendEmailUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, SendEmailUseCase])
], GoogleUseCase);
export { GoogleUseCase };
//# sourceMappingURL=google-usecase.js.map