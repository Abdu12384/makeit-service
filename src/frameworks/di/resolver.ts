import { container } from "tsyringe"
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller"
import { IClientAuthController } from "../../domain/interface/controllerInterfaces/auth/auth-controller.interface"
import { DependencyInjection } from "./index"
import { IUserController } from "../../domain/interface/controllerInterfaces/users/user-controller.intreface"
import { UserController } from "../../interfaceAdapters/controllers/user.controller"
import { IVendorController } from "../../domain/interface/controllerInterfaces/vendor/vendor-controller.interface"
import { VendorCantroller } from "../../interfaceAdapters/controllers/vendor.controller"
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/block.status.middleware"
import { IServiceController } from "../../domain/interface/controllerInterfaces/service/service-controller.interface"
import { ServiceController } from "../../interfaceAdapters/controllers/service.controller"
import { ICategoryController } from "../../domain/interface/controllerInterfaces/category/category-controller.interface"
import { CategoryController } from "../../interfaceAdapters/controllers/category.controller"
import { IBookingController } from "../../domain/interface/controllerInterfaces/booking/booking-controller.interface"
import { BookingController } from "../../interfaceAdapters/controllers/booking.controller"
import { IPaymentController } from "../../domain/interface/controllerInterfaces/payment/payment-cantroller.interface"
import { PaymentController } from "../../interfaceAdapters/controllers/payment.controller"
import { IEventController } from "../../domain/interface/controllerInterfaces/event/event-controller.interface"
import { EventController } from "../../interfaceAdapters/controllers/event.controller"
import { ITicketController } from "../../domain/interface/controllerInterfaces/ticket/ticket-controller"
import { TicketController } from "../../interfaceAdapters/controllers/ticket.contoller"
import { WalletController } from "../../interfaceAdapters/controllers/wallet.controller"
import { IWalletController } from "../../domain/interface/controllerInterfaces/wallet/wallet-controller.interface"
import { IWorkSampleController } from "../../domain/interface/controllerInterfaces/work-sample/work-sample-controller.interface"
import { WorkSampleController } from "../../interfaceAdapters/controllers/work-sample.controller"
import { IReviewController } from "../../domain/interface/controllerInterfaces/review/review-controller.interface"
import { ReviewController } from "../../interfaceAdapters/controllers/review.controller"
import { IDashboardControllerInterface } from "../../domain/interface/controllerInterfaces/dashboard/dashboard-controller.interface"
import DashboardController from "../../interfaceAdapters/controllers/dashboard.controller"
import { INotificationController } from "../../domain/interface/controllerInterfaces/notification/notification-controller.interface"
import { NotificationController } from "../../interfaceAdapters/controllers/notification.controller"
        




DependencyInjection.registerAll()


//=================== Middleware Resolving =====================

export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware)

// ================== Controller Resolving ====================== //
export const authController = 
      container.resolve<IClientAuthController>(AuthController);

export const userController = 
        container.resolve<IUserController>(UserController)

export const vendorController = 
         container.resolve<IVendorController>(VendorCantroller)

export const serviceController = 
         container.resolve<IServiceController>(ServiceController)

export const categoryController = 
         container.resolve<ICategoryController>(CategoryController)

export const bookingController = 
         container.resolve<IBookingController>(BookingController) 

export const paymentController = 
         container.resolve<IPaymentController>(PaymentController)
 
export const eventController = 
         container.resolve<IEventController>(EventController)

export const ticketController = 
         container.resolve<ITicketController>(TicketController)
         
export const walletController = 
         container.resolve<IWalletController>(WalletController)

export const workSampleController = 
         container.resolve<IWorkSampleController>(WorkSampleController)

export const reviewController = 
         container.resolve<IReviewController>(ReviewController)

export const dashboardController = 
         container.resolve<IDashboardControllerInterface>(DashboardController)

export const notificationController = 
         container.resolve<INotificationController>(NotificationController)
         