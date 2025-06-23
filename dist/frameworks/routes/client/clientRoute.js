import { Router } from "express";
import { authController, blockStatusMiddleware, userController, serviceController, bookingController, paymentController, eventController, ticketController, walletController, reviewController, workSampleController, notificationController } from "../../di/resolver.js";
import { decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware.js";
export class ClientRoute {
    clientRoute;
    constructor() {
        this.clientRoute = Router();
        this.setRoute();
    }
    setRoute() {
        this.clientRoute.put("/client/details", verifyAuth, 
        // authorizeRole(["client"])
        blockStatusMiddleware.checkStatus, (req, res) => {
            userController.updateUserDetails(req, res);
        });
        this.clientRoute.put("/client/change-password", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            userController.changePassword(req, res);
        });
        /** ==========================
         *  saveFCMToken
        * ========================== */
        this.clientRoute.post("/client/save-fcm-token", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            userController.saveFCMToken(req, res);
        });
        /** ==========================
         *  getClientNotifications
        * ========================== */
        this.clientRoute.get("/client/notifications", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            notificationController.getNotifications(req, res);
        });
        this.clientRoute.put("/client/notifications/read", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            notificationController.markNotificationAsRead(req, res);
        });
        /** ==========================
         *  Client Service Management Routes
        * ========================== */
        this.clientRoute.get("/client/services", 
        // verifyAuth,
        // authorizeRole(["client"])
        // blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            serviceController.getAllServices(req, res);
        });
        this.clientRoute.get("/client/services/:serviceId", 
        // verifyAuth,
        // blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            serviceController.getServiceById(req, res);
        });
        this.clientRoute.put("/client/profile", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            console.log('client profile');
            userController.updateUserDetails(req, res);
        });
        /** ==========================
         *  Client Booking Management Routes
        * ========================== */
        this.clientRoute.get("/client/bookings", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.getAllBookings(req, res);
        });
        this.clientRoute.post("/client/services/:serviceId/book", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.bookService(req, res);
        });
        this.clientRoute.post("/client/create-booking-payment", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            paymentController.handleBookingPayment(req, res);
        });
        this.clientRoute.post("/client/confirm-payment", 
        // verifyAuth,
        // blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            paymentController.confirmPayment(req, res);
        });
        this.clientRoute.put("/client/cancel-booking/:bookingId", 
        // verifyAuth,
        // blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            bookingController.cancelBooking(req, res);
        });
        /** ==========================
         *  Client Event  Routes
        * ========================== */
        this.clientRoute.get("/client/events", 
        //  verifyAuth,
        //  blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            eventController.getAllEvents(req, res);
        });
        this.clientRoute.get("/client/events/:eventId", 
        //  verifyAuth,
        //  blockStatusMiddleware.checkStatus as RequestHandler,
        (req, res) => {
            eventController.getEventById(req, res);
        });
        this.clientRoute.get("/client/events/:eventId/check-booking", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            eventController.checkEventBookingAvailability(req, res);
        });
        /** ==========================
         *  Client Ticket  Routes
        * ========================== */
        this.clientRoute.get("/client/tickets", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            ticketController.getAllTicketsByClientId(req, res);
        });
        this.clientRoute.post("/client/create-ticket", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            ticketController.createTicket(req, res);
        });
        this.clientRoute.post("/client/confirm-ticket-payment", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            ticketController.confirmTicketAndPayment(req, res);
        });
        this.clientRoute.put("/client/cancel-ticket/:ticketId", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            ticketController.cancelTicket(req, res);
        });
        /** ==========================
         *  Client Wallet Management Routes
        * ========================== */
        this.clientRoute.get("/client/wallet", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            walletController.getWalletById(req, res);
        });
        /** ==========================
         *  Client Review Management Routes
         * ========================== */
        this.clientRoute.get("/client/reviews", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            reviewController.getAllReviews(req, res);
        });
        this.clientRoute.post("/client/review", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            reviewController.createReview(req, res);
        });
        /** ==========================
         *  Client Vendor Work Sample Management Routes
         * ========================== */
        this.clientRoute.get("/client/work-sample/:vendorId", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            workSampleController.getAllWorkSamplesByVendorId(req, res);
        });
        /** ==========================
         *  Client Session Management Routes
        * ========================== */
        // logout
        this.clientRoute.post('/client/logout', verifyAuth, 
        // authorizeRole(["client"])
        blockStatusMiddleware.checkStatus, (req, res) => {
            authController.logout(req, res);
        });
        this.clientRoute.post("/client/refresh-token", decodeToken, (req, res) => {
            console.log("refreshing client", req.body);
            authController.handleTokenRefresh(req, res);
        });
    }
}
//# sourceMappingURL=clientRoute.js.map