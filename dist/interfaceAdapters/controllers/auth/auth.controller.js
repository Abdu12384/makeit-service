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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../../shared/constants");
const error_handler_1 = require("../../../shared/utils/error.handler");
const user_signup_validation_schema_1 = require("../../../useCases/auth/validation/user-signup.validation.schema");
const cookie_helper_1 = require("../../../shared/utils/cookie.helper");
let AuthController = class AuthController {
    constructor(_registerUseCase, _sendOtpEmailUseCase, _varifyOtpUseCase, _loginUseCase, _generateTokenUseCase, _googleUseCase, _refreshTokenUseCase, _blackListTokenUseCase, _revokeRefreshTokenUseCase, _forgotPasswordUseCase, _resetPasswordUseCase, _clearFCMTokenUseCase) {
        this._registerUseCase = _registerUseCase;
        this._sendOtpEmailUseCase = _sendOtpEmailUseCase;
        this._varifyOtpUseCase = _varifyOtpUseCase;
        this._loginUseCase = _loginUseCase;
        this._generateTokenUseCase = _generateTokenUseCase;
        this._googleUseCase = _googleUseCase;
        this._refreshTokenUseCase = _refreshTokenUseCase;
        this._blackListTokenUseCase = _blackListTokenUseCase;
        this._revokeRefreshTokenUseCase = _revokeRefreshTokenUseCase;
        this._forgotPasswordUseCase = _forgotPasswordUseCase;
        this._resetPasswordUseCase = _resetPasswordUseCase;
        this._clearFCMTokenUseCase = _clearFCMTokenUseCase;
    }
    // ══════════════════════════════════════════════════════════
    // 📧 Sending OTP to User Email
    // ══════════════════════════════════════════════════════════
    sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this._sendOtpEmailUseCase.execute(email);
                res.status(constants_1.HTTP_STATUS.OK).json(constants_1.SUCCESS_MESSAGES.OTP_SEND_SUCCESS);
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    // 📝 Register New User
    // ══════════════════════════════════════════════════════════
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { formdata, otpString } = req.body;
                yield this._varifyOtpUseCase.execute(formdata.email, otpString);
                const { role } = formdata;
                const schema = user_signup_validation_schema_1.userSchemas[role];
                if (!schema) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: true,
                        message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS
                    });
                    return;
                }
                const validatedData = schema.parse(formdata);
                const client = yield this._registerUseCase.createUsers(validatedData);
                res.status(constants_1.HTTP_STATUS.CREATED).json({ message: constants_1.SUCCESS_MESSAGES.CREATED, data: client });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    // 🔐 User Login Controller
    // ══════════════════════════════════════════════════════════
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                // const validatedData = loginSchema.parse(data)
                // if(!validatedData){
                //   res.status(HTTP_STATUS.BAD_REQUEST).json({
                //     success:false,
                //     message: ERROR_MESSAGES.INSUFFICIENT_FUNDS,
                //   })
                // }
                const user = yield this._loginUseCase.execute(data);
                if (!user.userId || !user.email || !user.role) {
                    throw new Error("User ID, email, or role is missing");
                }
                const token = yield this._generateTokenUseCase.execute(user.userId, user.email, user.role);
                const accessTokenName = `${user.role}_access_token`;
                const refreshTokenName = `${user.role}_refresh_token`;
                (0, cookie_helper_1.setAuthCookies)(res, token.accessToken, token.refreshToken, accessTokenName, refreshTokenName);
                const { password } = user, userWihoutPassword = __rest(user, ["password"]);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                    user: Object.assign({}, userWihoutPassword)
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  User Google Login Controller
    // ══════════════════════════════════════════════════════════
    authenticateWithGoogle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credential, client_id, role } = req.body;
                const user = yield this._googleUseCase.execute(credential, client_id, role);
                if (!user.userId || !user.email || !user.role) {
                    throw new Error("User ID, email, or role is missing");
                }
                const tokens = yield this._generateTokenUseCase.execute(user.userId, user.email, user.role);
                const accessTokenName = `${user.role}_access_token`;
                const refreshTokenName = `${user.role}_refresh_token`;
                (0, cookie_helper_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken, accessTokenName, refreshTokenName);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                    user: user,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  User Logout
    // ══════════════════════════════════════════════════════════
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._blackListTokenUseCase.execute(req.user.access_token);
                yield this._revokeRefreshTokenUseCase.execute(req.user.refresh_token);
                yield this._clearFCMTokenUseCase.execute(req.user.userId, req.user.role);
                const user = req.user;
                const accessTokenName = `${user.role}_access_token`;
                const refreshTokenName = `${user.role}_refresh_token`;
                (0, cookie_helper_1.clearAuthCookies)(res, accessTokenName, refreshTokenName);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Token Refresh Handler
    // ══════════════════════════════════════════════════════════
    handleTokenRefresh(req, res) {
        try {
            const refreshToken = req.user.refresh_token;
            const newTokens = this._refreshTokenUseCase.execute(refreshToken);
            const accessTokenName = `${newTokens.role}_access_token`;
            (0, cookie_helper_1.updateCookieWithAccessToken)(res, newTokens.accessToken, accessTokenName);
            res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                message: constants_1.SUCCESS_MESSAGES.OPERATION_SUCCESS
            });
        }
        catch (error) {
            (0, cookie_helper_1.clearAuthCookies)(res, `${req.user.role}_access_token`, `${req.user.role}_refresh_token`);
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                message: constants_1.ERROR_MESSAGES.INVALID_TOKEN
            });
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Forgot Password Handler
    // ══════════════════════════════════════════════════════════
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this._forgotPasswordUseCase.execute(email);
                res.status(constants_1.HTTP_STATUS.OK).json(constants_1.SUCCESS_MESSAGES.OTP_SEND_SUCCESS);
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Reset Password Handler
    // ══════════════════════════════════════════════════════════
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, token } = req.body;
                yield this._resetPasswordUseCase.execute(token, password);
                res.status(constants_1.HTTP_STATUS.OK).json(constants_1.SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IClientRegisterUseCase")),
    __param(1, (0, tsyringe_1.inject)("ISendOtpEmailUseCase")),
    __param(2, (0, tsyringe_1.inject)("IVerifyOtpEmailUseCase")),
    __param(3, (0, tsyringe_1.inject)("ILoginUserUseCase")),
    __param(4, (0, tsyringe_1.inject)("IGenerateTokenUseCase")),
    __param(5, (0, tsyringe_1.inject)("IGoogleUseCase")),
    __param(6, (0, tsyringe_1.inject)("IRefreshTokenUseCase")),
    __param(7, (0, tsyringe_1.inject)("IBlackListTokenUseCase")),
    __param(8, (0, tsyringe_1.inject)("IRevokeRefreshTokenUseCase")),
    __param(9, (0, tsyringe_1.inject)("IForgotPasswordUseCase")),
    __param(10, (0, tsyringe_1.inject)("IResetPasswordUseCase")),
    __param(11, (0, tsyringe_1.inject)("IClearFCMTokenUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AuthController);
//# sourceMappingURL=auth.controller.js.map