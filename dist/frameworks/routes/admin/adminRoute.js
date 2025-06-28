"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = require("express");
const resolver_1 = require("../../di/resolver");
const auth_middleware_1 = require("../../../interfaceAdapters/middlewares/auth.middleware");
class AdminRoute {
    constructor() {
        this.adminRoute = (0, express_1.Router)();
        this.setRoute();
    }
    setRoute() {
        /** =========================
         *  User Management Routes
         * ========================= */
        this.adminRoute.get('/admin/users', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => {
            resolver_1.userController.getAllUsers(req, res);
        });
        this.adminRoute.patch('/admin/user/status', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => {
            resolver_1.userController.updateUserStatus(req, res);
        });
        /** ==========================
            *  Vendor Management Routes
           * ========================== */
        this.adminRoute.get("/admin/vendors", auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => {
            resolver_1.vendorController.getAllVendors(req, res);
        });
        this.adminRoute.put('/admin/vendor/:vendorId', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), (req, res) => {
            resolver_1.vendorController.updateVendorStatus(req, res);
        });
        /** ==========================
         *  Session  Routes
        * ========================== */
        this.adminRoute.post('/admin/refresh-token', auth_middleware_1.decodeToken, (req, res) => {
            resolver_1.authController.handleTokenRefresh(req, res);
        });
        this.adminRoute.get("/admin/refresh-session", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.refreshSession(req, res);
        });
        /** ==========================
         *  Dashboard Routes
        * ========================== */
        this.adminRoute.get('/admin/dashboard', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.dashboardController.getAllDashboardData(req, res);
        });
        /** ==========================
         *  Category Management Routes
        * ========================== */
        this.adminRoute.post('/admin/category', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.categoryController.createCategory(req, res);
        });
        this.adminRoute.get('/admin/category', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.categoryController.getAllCategories(req, res);
        });
        this.adminRoute.patch('/admin/category/:id', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.categoryController.updateCategoryStatus(req, res);
        });
        this.adminRoute.put('/admin/category/:id', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.categoryController.editCategory(req, res);
        });
        /** ==========================
         *  Wallet Management Routes
        * ========================== */
        this.adminRoute.get('/admin/wallet', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.walletController.getWalletById(req, res);
        });
        this.adminRoute.get('/admin/events', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.eventController.getAllEvents(req, res);
        });
        this.adminRoute.get('/admin/bookings', auth_middleware_1.verifyAuth, (0, auth_middleware_1.authorizeRole)(['admin']), resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.getAllBookings(req, res);
        });
        // logout
        // ---------
        this.adminRoute.post("/admin/logout", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.authController.logout(req, res);
        });
    }
}
exports.AdminRoute = AdminRoute;
//# sourceMappingURL=adminRoute.js.map