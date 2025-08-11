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
exports.GoogleUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const google_auth_library_1 = require("google-auth-library");
const constants_1 = require("../../shared/constants");
const custom_error_1 = require("../../domain/utils/custom.error");
const send_email_usecase_1 = require("../common/send-email.usecase");
let GoogleUseCase = class GoogleUseCase {
    constructor(_registerUserUseCase, _clientRepository, _vendorRepository, _sendEmailUsecCase) {
        this._registerUserUseCase = _registerUserUseCase;
        this._clientRepository = _clientRepository;
        this._vendorRepository = _vendorRepository;
        this._sendEmailUsecCase = _sendEmailUsecCase;
        this._oAuthClient = new google_auth_library_1.OAuth2Client();
    }
    execute(credential, client_id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield this._oAuthClient.verifyIdToken({
                idToken: credential,
                audience: client_id,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_TOKEN, constants_1.HTTP_STATUS.UNAUTHORIZED);
            }
            const googleId = payload.sub;
            const email = payload.email;
            const profileImage = payload.picture || "";
            const name = payload.given_name || payload.family_name || "";
            if (!email) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.EMAIL_REQUIRED, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            let repository;
            if (role === 'client') {
                repository = this._clientRepository;
            }
            else if (role === 'vendor') {
                repository = this._vendorRepository;
            }
            else {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_ROLE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const existingUser = yield repository.findOne({ email });
            if (existingUser) {
                if (existingUser.status !== "active") {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BLOCKED, constants_1.HTTP_STATUS.FORBIDDEN);
                }
                return existingUser;
            }
            if (role === "vendor") {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.VENDOR_ACCOUNTS_CANNOT_BE_CREATED_USING_GOOGLE, constants_1.HTTP_STATUS.FORBIDDEN);
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
            const newUser = yield this._registerUserUseCase.createUsers(userData);
            if (!newUser) {
                throw new custom_error_1.CustomError("Registration failed", constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            this._sendEmailUsecCase.execute(email, "Welcom to MakeIT! Your Google Registration is Complete 🎉", 'welcom MakeIT');
            return newUser;
        });
    }
};
exports.GoogleUseCase = GoogleUseCase;
exports.GoogleUseCase = GoogleUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IClientRegisterUseCase")),
    __param(1, (0, tsyringe_1.inject)("IClientRepository")),
    __param(2, (0, tsyringe_1.inject)("IVendorRepository")),
    __param(3, (0, tsyringe_1.inject)("ISendEmailUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, send_email_usecase_1.SendEmailUseCase])
], GoogleUseCase);
//# sourceMappingURL=google-usecase.js.map