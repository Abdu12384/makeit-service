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
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomError } from "../../domain/utils/custom.error.js";
let UserController = class UserController {
    _getAllUserUserCase;
    _updateUserStatusUseCase;
    _getUserDetailsUseCase;
    _updateUserDetailsUseCase;
    _changePasswordUseCase;
    _saveFCMTokenUseCase;
    constructor(_getAllUserUserCase, _updateUserStatusUseCase, _getUserDetailsUseCase, _updateUserDetailsUseCase, _changePasswordUseCase, _saveFCMTokenUseCase) {
        this._getAllUserUserCase = _getAllUserUserCase;
        this._updateUserStatusUseCase = _updateUserStatusUseCase;
        this._getUserDetailsUseCase = _getUserDetailsUseCase;
        this._updateUserDetailsUseCase = _updateUserDetailsUseCase;
        this._changePasswordUseCase = _changePasswordUseCase;
        this._saveFCMTokenUseCase = _saveFCMTokenUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Users (Role Based)
    // ══════════════════════════════════════════════════════════
    async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 10, search = "", userType } = req.query;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const userTypeString = typeof userType === "string" ? userType : "client";
            const searchTermString = typeof search === "string" ? search : "";
            if (userType === "vendor") {
                const { users, total } = await this._getAllUserUserCase.execute("vendor", pageNumber, pageSize, searchTermString);
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    users,
                    totalPages: total,
                    currentPages: pageNumber
                });
                return;
            }
            const { users, total } = await this._getAllUserUserCase.execute(userTypeString, pageNumber, pageSize, searchTermString);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                users,
                totalPages: total,
                currentPages: pageNumber
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Update User Status
    // ══════════════════════════════════════════════════════════
    async updateUserStatus(req, res) {
        try {
            const { userType, userId } = req.query;
            await this._updateUserStatusUseCase.execute(userType, userId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //   Refresh Session
    // ══════════════════════════════════════════════════════════
    async refreshSession(req, res) {
        try {
            const { userId, role } = req.user;
            if (!userId || !role) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_TOKEN,
                });
                return;
            }
            const user = await this._getUserDetailsUseCase.execute(userId, role);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                user: user,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //   Update User Details
    // ══════════════════════════════════════════════════════════
    async updateUserDetails(req, res) {
        try {
            const data = req.body;
            console.log(data);
            const { userId, role } = req.user;
            const updatedUser = await this._updateUserDetailsUseCase.execute(userId, role, data);
            if (!updatedUser) {
                throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            }
            const { password, ...userWithoutPassword } = updatedUser;
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                user: userWithoutPassword,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //   Change Password
    // ══════════════════════════════════════════════════════════
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const { userId, role } = req.user;
            const updatedUser = await this._changePasswordUseCase.execute(userId, currentPassword, newPassword, role);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //   Save FCM Token
    // ══════════════════════════════════════════════════════════
    async saveFCMToken(req, res) {
        try {
            const { token } = req.body;
            const { userId, role } = req.user;
            const updatedUser = await this._saveFCMTokenUseCase.execute(userId, token, role);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
UserController = __decorate([
    injectable(),
    __param(0, inject("IGetAllUsersUseCase")),
    __param(1, inject("IUpdateUserStatusUseCase")),
    __param(2, inject("IGetUserDetailsUseCase")),
    __param(3, inject("IUpdateUserDetailsUseCase")),
    __param(4, inject("IChangePasswordUseCase")),
    __param(5, inject("ISaveFCMTokenUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map