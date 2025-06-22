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
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants.js";
import { handleErrorResponse } from "../../../shared/utils/error.handler.js";
import { userSchemas } from "../../../useCases/auth/validation/user-signup.validation.schema.js";
import { clearAuthCookies, setAuthCookies, updateCookieWithAccessToken } from "../../../shared/utils/cookie.helper.js";
let AuthController = class AuthController {
    _registerUseCase;
    _sendOtpEmailUseCase;
    _varifyOtpUseCase;
    _loginUseCase;
    _generateTokenUseCase;
    _googleUseCase;
    _refreshTokenUseCase;
    _blackListTokenUseCase;
    _revokeRefreshTokenUseCase;
    _forgotPasswordUseCase;
    _resetPasswordUseCase;
    _clearFCMTokenUseCase;
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
    async sendOtp(req, res) {
        try {
            console.log('otpsend', req.body);
            const { email } = req.body;
            console.log('otp sending....');
            await this._sendOtpEmailUseCase.execute(email);
            res.status(HTTP_STATUS.OK).json(SUCCESS_MESSAGES.OTP_SEND_SUCCESS);
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    // 📝 Register New User
    // ══════════════════════════════════════════════════════════
    async register(req, res) {
        try {
            const { formdata, otpString } = req.body;
            console.log('varifying...', formdata, otpString);
            await this._varifyOtpUseCase.execute(formdata.email, otpString);
            const { role } = formdata;
            console.log(role);
            const schema = userSchemas[role];
            console.log(schema);
            if (!schema) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: true,
                    message: ERROR_MESSAGES.INVALID_CREDENTIALS
                });
                return;
            }
            const validatedData = schema.parse(formdata);
            const client = await this._registerUseCase.createUsers(validatedData);
            res.status(HTTP_STATUS.CREATED).json({ message: SUCCESS_MESSAGES.CREATED, data: client });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    // 🔐 User Login Controller
    // ══════════════════════════════════════════════════════════
    async login(req, res) {
        try {
            const data = req.body;
            console.log('user data', data);
            // const validatedData = loginSchema.parse(data)
            // if(!validatedData){
            //   res.status(HTTP_STATUS.BAD_REQUEST).json({
            //     success:false,
            //     message: ERROR_MESSAGES.INSUFFICIENT_FUNDS,
            //   })
            // }
            const user = await this._loginUseCase.execute(data);
            if (!user.userId || !user.email || !user.role) {
                throw new Error("User ID, email, or role is missing");
            }
            const token = await this._generateTokenUseCase.execute(user.userId, user.email, user.role);
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
            setAuthCookies(res, token.accessToken, token.refreshToken, accessTokenName, refreshTokenName);
            const { password, ...userWihoutPassword } = user;
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
                user: {
                    ...userWihoutPassword,
                }
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  User Google Login Controller
    // ══════════════════════════════════════════════════════════
    async authenticateWithGoogle(req, res) {
        try {
            const { credential, client_id, role } = req.body;
            const user = await this._googleUseCase.execute(credential, client_id, role);
            if (!user.userId || !user.email || !user.role) {
                throw new Error("User ID, email, or role is missing");
            }
            const tokens = await this._generateTokenUseCase.execute(user.userId, user.email, user.role);
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
            setAuthCookies(res, tokens.accessToken, tokens.refreshToken, accessTokenName, refreshTokenName);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
                user: user,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  User Logout
    // ══════════════════════════════════════════════════════════
    async logout(req, res) {
        try {
            await this._blackListTokenUseCase.execute(req.user.access_token);
            await this._revokeRefreshTokenUseCase.execute(req.user.refresh_token);
            await this._clearFCMTokenUseCase.execute(req.user.userId, req.user.role);
            const user = req.user;
            console.log(user, 'logout user');
            const accessTokenName = `${user.role}_access_token`;
            const refreshTokenName = `${user.role}_refresh_token`;
            clearAuthCookies(res, accessTokenName, refreshTokenName);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Token Refresh Handler
    // ══════════════════════════════════════════════════════════
    handleTokenRefresh(req, res) {
        try {
            const refreshToken = req.user.refresh_token;
            const newTokens = this._refreshTokenUseCase.execute(refreshToken);
            const accessTokenName = `${newTokens.role}_access_token`;
            updateCookieWithAccessToken(res, newTokens.accessToken, accessTokenName);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESS
            });
        }
        catch (error) {
            clearAuthCookies(res, `${req.user.role}_access_token`, `${req.user.role}_refresh_token`);
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: ERROR_MESSAGES.INVALID_TOKEN
            });
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Forgot Password Handler
    // ══════════════════════════════════════════════════════════
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            await this._forgotPasswordUseCase.execute(email);
            res.status(HTTP_STATUS.OK).json(SUCCESS_MESSAGES.OTP_SEND_SUCCESS);
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Reset Password Handler
    // ══════════════════════════════════════════════════════════
    async resetPassword(req, res) {
        try {
            const { password, token } = req.body;
            console.log('token', token, password);
            await this._resetPasswordUseCase.execute(token, password);
            res.status(HTTP_STATUS.OK).json(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
AuthController = __decorate([
    injectable(),
    __param(0, inject("IClientRegisterUseCase")),
    __param(1, inject("ISendOtpEmailUseCase")),
    __param(2, inject("IVerifyOtpEmailUseCase")),
    __param(3, inject("ILoginUserUseCase")),
    __param(4, inject("IGenerateTokenUseCase")),
    __param(5, inject("IGoogleUseCase")),
    __param(6, inject("IRefreshTokenUseCase")),
    __param(7, inject("IBlackListTokenUseCase")),
    __param(8, inject("IRevokeRefreshTokenUseCase")),
    __param(9, inject("IForgotPasswordUseCase")),
    __param(10, inject("IResetPasswordUseCase")),
    __param(11, inject("IClearFCMTokenUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map