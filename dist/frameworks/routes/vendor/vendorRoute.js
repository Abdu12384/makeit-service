"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../../interfaceAdapters/middlewares/auth.middleware");
const resolver_1 = require("../../di/resolver");
class VendorRoute {
    constructor() {
        this.vendorRoute = (0, express_1.Router)();
        this.setRoute();
    }
    setRoute() {
        this.vendorRoute.put("/vendor/details", auth_middleware_1.verifyAuth, 
        // authorizeRole(["vendor"])
        resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.updateUserDetails(req, res);
        });
        this.vendorRoute.put("/vendor/change-password", auth_middleware_1.verifyAuth, 
        // authorizeRole(["vendor"])
        resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.changePassword(req, res);
        });
        /** ==========================
         *  FCM Token Management Routes
        * ========================== */
        this.vendorRoute.post("/vendor/fcm-token", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.saveFCMToken(req, res);
        });
        /** ==========================
         *  Service Management Routes
        * ========================== */
        this.vendorRoute.post("/vendor/service", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.serviceController.addService(req, res);
        });
        this.vendorRoute.get("/vendor/service", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.serviceController.getAllServices(req, res);
        });
        this.vendorRoute.put("/vendor/service/:serviceId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.serviceController.editService(req, res);
        });
        this.vendorRoute.patch("/vendor/service/:serviceId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.serviceController.updateServiceStatus(req, res);
        });
        this.vendorRoute.patch("/vendor/service/block/:serviceId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.serviceController.blockService(req, res);
        });
        this.vendorRoute.get("/vendor/categories", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.categoryController.getAllCategories(req, res);
        });
        /** ==========================
         *  Session Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/notifications", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.notificationController.getNotifications(req, res);
        });
        this.vendorRoute.put("/vendor/notifications/read", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.notificationController.markNotificationAsRead(req, res);
        });
        /** ==========================
         *   Booking Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/bookings", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.getAllBookings(req, res);
        });
        this.vendorRoute.patch("/vendor/bookings/:bookingId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.updateBookingStatus(req, res);
        });
        this.vendorRoute.get("/vendor/booked-dates", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.getBookedDates(req, res);
        });
        /** ==========================
         *  Event Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/event", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.eventController.getAllEventsByVendorId(req, res);
        });
        this.vendorRoute.post("/vendor/event", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.eventController.createEvent(req, res);
        });
        this.vendorRoute.put("/vendor/event/:eventId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.eventController.editEvent(req, res);
        });
        this.vendorRoute.patch("/vendor/event/block/:eventId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.eventController.blockEvent(req, res);
        });
        this.vendorRoute.get("/vendor/events/attendees/:eventId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.eventController.getAttendeesById(req, res);
        });
        this.vendorRoute.patch("/vendor/bookings/:bookingId/reschedule", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.rescheduleBooking(req, res);
        });
        /** ==========================
         *  Ticket Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/verify-ticket/:ticketId/:eventId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.ticketController.verifyTicket(req, res);
        });
        /** ==========================
         *  Wallet Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/wallet", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.walletController.getWalletById(req, res);
        });
        /** ==========================
         *  Work Sample Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/work-sample", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.workSampleController.getAllWorkSamplesByVendorId(req, res);
        });
        this.vendorRoute.post("/vendor/work-sample", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.workSampleController.createWorkSample(req, res);
        });
        this.vendorRoute.put("/vendor/work-sample/:workSampleId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.workSampleController.updateWorkSample(req, res);
        });
        /** ==========================
         *  Dashboard Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/dashboard", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.dashboardController.getAllDashboardData(req, res);
        });
        /** ==========================
         *  Session Management Routes
        * ========================== */
        this.vendorRoute.post('/vendor/logout', auth_middleware_1.verifyAuth, 
        //  authorizeRole(["vendor"])
        resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.authController.logout(req, res);
        });
        this.vendorRoute.post('/vendor/refresh-token', auth_middleware_1.decodeToken, (req, res) => {
            console.log("refreshing Admin", req.body);
            resolver_1.authController.handleTokenRefresh(req, res);
        });
    }
}
exports.VendorRoute = VendorRoute;
//# sourceMappingURL=vendorRoute.js.map