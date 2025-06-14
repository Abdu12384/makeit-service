import { Router } from "express";
import { decodeToken, verifyAuth } from "../../../interfaceAdapters/middlewares/auth.middleware.js";
import { authController, blockStatusMiddleware, userController, serviceController, categoryController, bookingController, eventController, walletController, ticketController, workSampleController, dashboardController } from "../../di/resolver.js";
export class VendorRoute {
    vendorRoute;
    constructor() {
        this.vendorRoute = Router();
        this.setRoute();
    }
    setRoute() {
        this.vendorRoute.put("/vendor/details", verifyAuth, 
        // authorizeRole(["vendor"])
        blockStatusMiddleware.checkStatus, (req, res) => {
            userController.updateUserDetails(req, res);
        });
        this.vendorRoute.put("/vendor/change-password", verifyAuth, 
        // authorizeRole(["vendor"])
        blockStatusMiddleware.checkStatus, (req, res) => {
            userController.changePassword(req, res);
        });
        /** ==========================
         *  Service Management Routes
        * ========================== */
        this.vendorRoute.post("/vendor/service", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            serviceController.addService(req, res);
        });
        this.vendorRoute.get("/vendor/service", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            serviceController.getAllServices(req, res);
        });
        this.vendorRoute.put("/vendor/service/:serviceId", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            serviceController.editService(req, res);
        });
        this.vendorRoute.patch("/vendor/service/:serviceId", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            serviceController.updateServiceStatus(req, res);
        });
        this.vendorRoute.get("/vendor/categories", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            categoryController.getAllCategories(req, res);
        });
        /** ==========================
         *   Booking Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/bookings", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.getAllBookings(req, res);
        });
        this.vendorRoute.patch("/vendor/bookings/:bookingId", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            bookingController.updateBookingStatus(req, res);
        });
        /** ==========================
         *  Event Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/event", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            eventController.getAllEventsByVendorId(req, res);
        });
        this.vendorRoute.post("/vendor/event", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            eventController.createEvent(req, res);
        });
        this.vendorRoute.put("/vendor/event/:eventId", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            eventController.editEvent(req, res);
        });
        this.vendorRoute.get("/vendor/events/attendees/:eventId", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            eventController.getAttendeesById(req, res);
        });
        /** ==========================
         *  Ticket Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/verify-ticket/:ticketId/:eventId", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            ticketController.verifyTicket(req, res);
        });
        /** ==========================
         *  Wallet Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/wallet", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            walletController.getWalletById(req, res);
        });
        /** ==========================
         *  Work Sample Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/work-sample", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            workSampleController.getAllWorkSamplesByVendorId(req, res);
        });
        this.vendorRoute.post("/vendor/work-sample", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            workSampleController.createWorkSample(req, res);
        });
        this.vendorRoute.put("/vendor/work-sample/:workSampleId", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            workSampleController.updateWorkSample(req, res);
        });
        /** ==========================
         *  Dashboard Management Routes
        * ========================== */
        this.vendorRoute.get("/vendor/dashboard", verifyAuth, blockStatusMiddleware.checkStatus, (req, res) => {
            dashboardController.getAllDashboardData(req, res);
        });
        /** ==========================
         *  Session Management Routes
        * ========================== */
        this.vendorRoute.post('/vendor/logout', verifyAuth, 
        //  authorizeRole(["vendor"])
        blockStatusMiddleware.checkStatus, (req, res) => {
            authController.logout(req, res);
        });
        this.vendorRoute.post('/vendor/refresh-token', decodeToken, (req, res) => {
            console.log("refreshing Admin", req.body);
            authController.handleTokenRefresh(req, res);
        });
    }
}
//# sourceMappingURL=vendorRoute.js.map