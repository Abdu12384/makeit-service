"use strict";
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
exports.decodeToken = exports.authorizeRole = exports.verifyAuth = void 0;
const jwt_service_1 = require("../../useCases/services/jwt-service");
const constants_1 = require("../../shared/constants");
const redis_client_1 = require("../../frameworks/cashe/redis.client");
const tokenServiec = new jwt_service_1.JWTService();
// ========================================================================
//  VerifyAuth Middleware
// ========================================================================
const verifyAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = extractToken(req);
        if (!token) {
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: constants_1.ERROR_MESSAGES.TOKEN_BLACKLISTED
            });
            return;
        }
        if (yield isBlacklisted(token.access_token)) {
            res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: constants_1.ERROR_MESSAGES.TOKEN_BLACKLISTED,
            });
            return;
        }
        const user = tokenServiec.verifyAccessToken(token.access_token);
        if (!user || !user.userId) {
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                message: constants_1.ERROR_MESSAGES.TOKEN_EXPIRED
            });
            return;
        }
        req.user = Object.assign(Object.assign({}, user), { access_token: token.access_token, refresh_token: token.refresh_token });
        next();
    }
    catch (error) {
        if (error instanceof Error && error.name === "TokenExpiredError") {
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                message: constants_1.ERROR_MESSAGES.TOKEN_EXPIRED
            });
            return;
        }
        res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
            message: constants_1.ERROR_MESSAGES.INVALID_TOKEN
        });
        return;
    }
});
exports.verifyAuth = verifyAuth;
// ========================================================================
//  Extract Token Helper Fn
// ========================================================================
const extractToken = (req) => {
    var _a, _b, _c, _d;
    const userType = req.path.split("/")[1];
    if (!userType)
        return null;
    return {
        access_token: (_b = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[`${userType}_access_token`]) !== null && _b !== void 0 ? _b : null,
        refresh_token: (_d = (_c = req.cookies) === null || _c === void 0 ? void 0 : _c[`${userType}_refresh_token`]) !== null && _d !== void 0 ? _d : null
    };
};
// ========================================================================
//  Blacklist checker Fn
// ========================================================================
const isBlacklisted = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield redis_client_1.redisClient.get(token);
        return result !== null;
    }
    catch (error) {
        console.error("Redis error:", error);
        return false;
    }
});
// ========================================================================
// Authorize Role Middlewere
// ========================================================================
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: constants_1.ERROR_MESSAGES.NOT_ALLOWED,
                userRole: user ? user.role : "none"
            });
            return;
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
// ========================================================================
// Decode Token MiddleWare
// ========================================================================
const decodeToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = extractToken(req);
        if (!token) {
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS
            });
            return;
        }
        if (yield isBlacklisted(token.access_token)) {
            res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                message: constants_1.ERROR_MESSAGES.TOKEN_BLACKLISTED,
            });
            return;
        }
        const user = tokenServiec.decodeAccessToken(token === null || token === void 0 ? void 0 : token.access_token);
        req.user = {
            userId: user === null || user === void 0 ? void 0 : user.userId,
            email: user === null || user === void 0 ? void 0 : user.email,
            role: user === null || user === void 0 ? void 0 : user.role,
            access_token: token.access_token,
            refresh_token: token.refresh_token
        };
        next();
    }
    catch (error) { }
});
exports.decodeToken = decodeToken;
//# sourceMappingURL=auth.middleware.js.map