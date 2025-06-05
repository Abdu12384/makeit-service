import { container } from "tsyringe"
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller.js"
import { IClientAuthController } from "../../domain/interface/controllerInterfaces/auth/auth-controller.interface.js"
import { DependencyInjection } from "./index.js"
import { IUserController } from "../../domain/interface/controllerInterfaces/users/user-controller.intreface.js"
import { UserController } from "../../interfaceAdapters/controllers/user.controller.js"
import { IVendorController } from "../../domain/interface/controllerInterfaces/vendor/vendor-controller.interface.js"
import { VendorCantroller } from "../../interfaceAdapters/controllers/vendor.controller.js"
import { BlockStatusMiddleware } from "../../interfaceAdapters/middlewares/block.status.middleware.js"
import { IServiceController } from "../../domain/interface/controllerInterfaces/service/service-controller.interface.js"
import { ServiceController } from "../../interfaceAdapters/controllers/service.controller.js"
import { ICategoryController } from "../../domain/interface/controllerInterfaces/category/category-controller.interface.js"
import { CategoryController } from "../../interfaceAdapters/controllers/category.controller.js"
import { IBookingController } from "../../domain/interface/controllerInterfaces/booking/booking-controller.interface.js"
import { BookingController } from "../../interfaceAdapters/controllers/booking.controller.js"
import { IPaymentController } from "../../domain/interface/controllerInterfaces/payment/payment-cantroller.interface.js"
import { PaymentController } from "../../interfaceAdapters/controllers/payment.controller.js"
import { IEventController } from "../../domain/interface/controllerInterfaces/event/event-controller.interface.js"
import { EventController } from "../../interfaceAdapters/controllers/event.controller.js"
import { ITicketController } from "../../domain/interface/controllerInterfaces/ticket/ticket-controller.js"
import { TicketController } from "../../interfaceAdapters/controllers/ticket.contoller.js"
import { WalletController } from "../../interfaceAdapters/controllers/wallet.controller.js"
import { IWalletController } from "../../domain/interface/controllerInterfaces/wallet/wallet-controller.interface.js"
import { IWorkSampleController } from "../../domain/interface/controllerInterfaces/work-sample/work-sample-controller.interface.js"
import { WorkSampleController } from "../../interfaceAdapters/controllers/work-sample.controller.js"
import { IReviewController } from "../../domain/interface/controllerInterfaces/review/review-controller.interface.js"
import { ReviewController } from "../../interfaceAdapters/controllers/review.controller.js"
import { IDashboardControllerInterface } from "../../domain/interface/controllerInterfaces/dashboard/dashboard-controller.interface.js"
import DashboardController from "../../interfaceAdapters/controllers/dashboard.controller.js"
            




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
         