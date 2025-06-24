"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.dashboardController = exports.reviewController = exports.workSampleController = exports.walletController = exports.ticketController = exports.eventController = exports.paymentController = exports.bookingController = exports.categoryController = exports.serviceController = exports.vendorController = exports.userController = exports.authController = exports.blockStatusMiddleware = void 0;
const tsyringe_1 = require("tsyringe");
const auth_controller_1 = require("../../interfaceAdapters/controllers/auth/auth.controller");
const index_1 = require("./index");
const user_controller_1 = require("../../interfaceAdapters/controllers/user.controller");
const vendor_controller_1 = require("../../interfaceAdapters/controllers/vendor.controller");
const block_status_middleware_1 = require("../../interfaceAdapters/middlewares/block.status.middleware");
const service_controller_1 = require("../../interfaceAdapters/controllers/service.controller");
const category_controller_1 = require("../../interfaceAdapters/controllers/category.controller");
const booking_controller_1 = require("../../interfaceAdapters/controllers/booking.controller");
const payment_controller_1 = require("../../interfaceAdapters/controllers/payment.controller");
const event_controller_1 = require("../../interfaceAdapters/controllers/event.controller");
const ticket_contoller_1 = require("../../interfaceAdapters/controllers/ticket.contoller");
const wallet_controller_1 = require("../../interfaceAdapters/controllers/wallet.controller");
const work_sample_controller_1 = require("../../interfaceAdapters/controllers/work-sample.controller");
const review_controller_1 = require("../../interfaceAdapters/controllers/review.controller");
const dashboard_controller_1 = __importDefault(require("../../interfaceAdapters/controllers/dashboard.controller"));
const notification_controller_1 = require("../../interfaceAdapters/controllers/notification.controller");
index_1.DependencyInjection.registerAll();
//=================== Middleware Resolving =====================
exports.blockStatusMiddleware = tsyringe_1.container.resolve(block_status_middleware_1.BlockStatusMiddleware);
// ================== Controller Resolving ====================== //
exports.authController = tsyringe_1.container.resolve(auth_controller_1.AuthController);
exports.userController = tsyringe_1.container.resolve(user_controller_1.UserController);
exports.vendorController = tsyringe_1.container.resolve(vendor_controller_1.VendorCantroller);
exports.serviceController = tsyringe_1.container.resolve(service_controller_1.ServiceController);
exports.categoryController = tsyringe_1.container.resolve(category_controller_1.CategoryController);
exports.bookingController = tsyringe_1.container.resolve(booking_controller_1.BookingController);
exports.paymentController = tsyringe_1.container.resolve(payment_controller_1.PaymentController);
exports.eventController = tsyringe_1.container.resolve(event_controller_1.EventController);
exports.ticketController = tsyringe_1.container.resolve(ticket_contoller_1.TicketController);
exports.walletController = tsyringe_1.container.resolve(wallet_controller_1.WalletController);
exports.workSampleController = tsyringe_1.container.resolve(work_sample_controller_1.WorkSampleController);
exports.reviewController = tsyringe_1.container.resolve(review_controller_1.ReviewController);
exports.dashboardController = tsyringe_1.container.resolve(dashboard_controller_1.default);
exports.notificationController = tsyringe_1.container.resolve(notification_controller_1.NotificationController);
//# sourceMappingURL=resolver.js.map