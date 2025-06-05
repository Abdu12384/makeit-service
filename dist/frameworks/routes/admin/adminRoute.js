import { Router } from "express";
import { authController, blockStatusMiddleware, bookingController, categoryController, dashboardController, eventController, userController, vendorController, walletController } from "../../di/resolver.js";
import { authorizeRole, decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware.js";
export class AdminRoute {
    adminRoute;
    constructor() {
        this.adminRoute = Router();
        this.setRoute();
    }
    setRoute() {
        /** =========================
         *  User Management Routes
         * ========================= */
        this.adminRoute.get('/admin/users', verifyAuth, authorizeRole(['admin']), (req, res) => {
            userController.getAllUsers(req, res);
        });
        this.adminRoute.patch('/admin/user/status', verifyAuth, authorizeRole(['admin']), (req, res) => {
            userController.updateUserStatus(req, res);
        });
        /** ==========================
            *  Vendor Management Routes
           * ========================== */
        this.adminRoute.get("/admin/vendors", verifyAuth, authorizeRole(['admin']), (req, res) => {
            vendorController.getAllVendors(req, res);
        });
        this.adminRoute.put('/admin/vendor/:vendorId', verifyAuth, authorizeRole(['admin']), (req, res) => {
            vendorController.updateVendorStatus(req, res);
        });
        /** ==========================
         *  Session  Routes
        * ========================== */
        this.adminRoute.post('/admin/refresh-token', decodeToken, (req, res) => {
            console.log("refreshing Admin", req.body);
            authController.handleTokenRefresh(req, res);
        });
        this.adminRoute.get("/admin/refresh-session", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            userController.refreshSession(req, res);
        });
        /** ==========================
         *  Dashboard Routes
        * ========================== */
        this.adminRoute.get('/admin/dashboard', verifyAuth, authorizeRole(['admin']), blockStatusMiddleware.checkStatus, (req, res) => {
            dashboardController.getAllDashboardData(req, res);
        });
        /** ==========================
         *  Category Management Routes
        * ========================== */
        this.adminRoute.post('/admin/category', verifyAuth, authorizeRole(['admin']), blockStatusMiddleware.checkStatus, (req, res) => {
            categoryController.createCategory(req, res);
        });
        this.adminRoute.get('/admin/category', verifyAuth, authorizeRole(['admin']), blockStatusMiddleware.checkStatus, (req, res) => {
            categoryController.getAllCategories(req, res);
        });
        this.adminRoute.patch('/admin/category/:id', verifyAuth, authorizeRole(['admin']), blockStatusMiddleware.checkStatus, (req, res) => {
            categoryController.updateCategoryStatus(req, res);
        });
        this.adminRoute.put('/admin/category/:id', verifyAuth, authorizeRole(['admin']), blockStatusMiddleware.checkStatus, (req, res) => {
            categoryController.editCategory(req, res);
        });
        /** ==========================
         *  Wallet Management Routes
        * ========================== */
        this.adminRoute.get('/admin/wallet', verifyAuth, authorizeRole(['admin']), blockStatusMiddleware.checkStatus, (req, res) => {
            walletController.getWalletById(req, res);
        });
        this.adminRoute.get('/admin/events', verifyAuth, authorizeRole(['admin']), blockStatusMiddleware.checkStatus, (req, res) => {
            console.log(req.body),
                eventController.getAllEvents(req, res);
        });
        this.adminRoute.get('/admin/bookings', verifyAuth, authorizeRole(['admin']), blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.getAllBookings(req, res);
        });
        // logout
        // ---------
        this.adminRoute.post("/admin/logout", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            authController.logout(req, res);
        });
    }
}
//# sourceMappingURL=adminRoute.js.map