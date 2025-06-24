"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = require("express");
const resolver_1 = require("../../di/resolver");
class AuthRoute {
    constructor() {
        this.authRoute = (0, express_1.Router)();
        this.setRoute();
    }
    setRoute() {
        this.authRoute.post('/signup', (req, res) => resolver_1.authController.register(req, res));
        this.authRoute.post('/send-otp', (req, res) => resolver_1.authController.sendOtp(req, res));
        this.authRoute.post('/login', (req, res) => resolver_1.authController.login(req, res));
        this.authRoute.post('/google-auth', (req, res) => resolver_1.authController.authenticateWithGoogle(req, res));
        this.authRoute.post('/forgot-password', (req, res) => resolver_1.authController.forgotPassword(req, res));
        this.authRoute.post('/reset-password', (req, res) => resolver_1.authController.resetPassword(req, res));
    }
}
exports.AuthRoute = AuthRoute;
//# sourceMappingURL=authRoute.js.map