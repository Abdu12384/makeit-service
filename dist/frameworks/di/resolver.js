import { container } from "tsyringe";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller.js";
import { DependencyInjection } from "./index.js";
import { UserController } from "../../interfaceAdapters/controllers/user.controller.js";
import { VendorCantroller } from "../../interfaceAdapters/controllers/vendor.controller.js";
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/block.status.middleware.js";
import { ServiceController } from "../../interfaceAdapters/controllers/service.controller.js";
import { CategoryController } from "../../interfaceAdapters/controllers/category.controller.js";
import { BookingController } from "../../interfaceAdapters/controllers/booking.controller.js";
import { PaymentController } from "../../interfaceAdapters/controllers/payment.controller.js";
import { EventController } from "../../interfaceAdapters/controllers/event.controller.js";
import { TicketController } from "../../interfaceAdapters/controllers/ticket.contoller.js";
import { WalletController } from "../../interfaceAdapters/controllers/wallet.controller.js";
import { WorkSampleController } from "../../interfaceAdapters/controllers/work-sample.controller.js";
import { ReviewController } from "../../interfaceAdapters/controllers/review.controller.js";
import DashboardController from "../../interfaceAdapters/controllers/dashboard.controller.js";
import { NotificationController } from "../../interfaceAdapters/controllers/notification.controller.js";
DependencyInjection.registerAll();
//=================== Middleware Resolving =====================
export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);
// ================== Controller Resolving ====================== //
export const authController = container.resolve(AuthController);
export const userController = container.resolve(UserController);
export const vendorController = container.resolve(VendorCantroller);
export const serviceController = container.resolve(ServiceController);
export const categoryController = container.resolve(CategoryController);
export const bookingController = container.resolve(BookingController);
export const paymentController = container.resolve(PaymentController);
export const eventController = container.resolve(EventController);
export const ticketController = container.resolve(TicketController);
export const walletController = container.resolve(WalletController);
export const workSampleController = container.resolve(WorkSampleController);
export const reviewController = container.resolve(ReviewController);
export const dashboardController = container.resolve(DashboardController);
export const notificationController = container.resolve(NotificationController);
//# sourceMappingURL=resolver.js.map