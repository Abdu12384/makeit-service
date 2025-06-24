"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoute = void 0;
const express_1 = require("express");
const resolver_1 = require("../../di/resolver");
const auth_middleware_1 = require("../../../interfaceAdapters/middlewares/auth.middleware");
class ClientRoute {
    constructor() {
        this.clientRoute = (0, express_1.Router)();
        this.setRoute();
    }
    setRoute() {
        this.clientRoute.put("/client/details", auth_middleware_1.verifyAuth, 
        // authorizeRole(["client"])
        resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.updateUserDetails(req, res);
        });
        this.clientRoute.put("/client/change-password", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.changePassword(req, res);
        });
        /** ==========================
         *  saveFCMToken
        * ========================== */
        this.clientRoute.post("/client/save-fcm-token", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.userController.saveFCMToken(req, res);
        });
        /** ==========================
         *  getClientNotifications
        * ========================== */
        this.clientRoute.get("/client/notifications", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.notificationController.getNotifications(req, res);
        });
        this.clientRoute.put("/client/notifications/read", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.notificationController.markNotificationAsRead(req, res);
        });
        /** ==========================
         *  Client Service Management Routes
        * ========================== */
        this.clientRoute.get("/client/services", 
        // verifyAuth,
        // authorizeRole(["client"])
        // blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            resolver_1.serviceController.getAllServices(req, res);
        });
        this.clientRoute.get("/client/services/:serviceId", 
        // verifyAuth,
        // blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            resolver_1.serviceController.getServiceById(req, res);
        });
        this.clientRoute.put("/client/profile", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            console.log('client profile');
            resolver_1.userController.updateUserDetails(req, res);
        });
        /** ==========================
         *  Client Booking Management Routes
        * ========================== */
        this.clientRoute.get("/client/bookings", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.getAllBookings(req, res);
        });
        this.clientRoute.post("/client/services/:serviceId/book", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.bookingController.bookService(req, res);
        });
        this.clientRoute.post("/client/create-booking-payment", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.paymentController.handleBookingPayment(req, res);
        });
        this.clientRoute.post("/client/confirm-payment", 
        // verifyAuth,
        // blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            resolver_1.paymentController.confirmPayment(req, res);
        });
        this.clientRoute.put("/client/cancel-booking/:bookingId", 
        // verifyAuth,
        // blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            resolver_1.bookingController.cancelBooking(req, res);
        });
        /** ==========================
         *  Client Event  Routes
        * ========================== */
        this.clientRoute.get("/client/events", 
        //  verifyAuth,
        //  blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            resolver_1.eventController.getAllEvents(req, res);
        });
        this.clientRoute.get("/client/events/:eventId", 
        //  verifyAuth,
        //  blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            resolver_1.eventController.getEventById(req, res);
        });
        this.clientRoute.get("/client/events/:eventId/check-booking", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.eventController.checkEventBookingAvailability(req, res);
        });
        /** ==========================
         *  Client Ticket  Routes
        * ========================== */
        this.clientRoute.get("/client/tickets", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.ticketController.getAllTicketsByClientId(req, res);
        });
        this.clientRoute.post("/client/create-ticket", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.ticketController.createTicket(req, res);
        });
        this.clientRoute.post("/client/confirm-ticket-payment", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.ticketController.confirmTicketAndPayment(req, res);
        });
        this.clientRoute.put("/client/cancel-ticket/:ticketId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.ticketController.cancelTicket(req, res);
        });
        /** ==========================
         *  Client Wallet Management Routes
        * ========================== */
        this.clientRoute.get("/client/wallet", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.walletController.getWalletById(req, res);
        });
        /** ==========================
         *  Client Review Management Routes
         * ========================== */
        this.clientRoute.get("/client/reviews", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.reviewController.getAllReviews(req, res);
        });
        this.clientRoute.post("/client/review", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.reviewController.createReview(req, res);
        });
        /** ==========================
         *  Client Vendor Work Sample Management Routes
         * ========================== */
        this.clientRoute.get("/client/work-sample/:vendorId", auth_middleware_1.verifyAuth, resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.workSampleController.getAllWorkSamplesByVendorId(req, res);
        });
        /** ==========================
         *  Client Session Management Routes
        * ========================== */
        // logout
        this.clientRoute.post('/client/logout', auth_middleware_1.verifyAuth, 
        // authorizeRole(["client"])
        resolver_1.blockStatusMiddleware.checkStatus, (req, res) => {
            resolver_1.authController.logout(req, res);
        });
        this.clientRoute.post("/client/refresh-token", auth_middleware_1.decodeToken, (req, res) => {
            console.log("refreshing client", req.body);
            resolver_1.authController.handleTokenRefresh(req, res);
        });
    }
}
exports.ClientRoute = ClientRoute;
//# sourceMappingURL=clientRoute.js.map