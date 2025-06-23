import { container } from "tsyringe";
import { IRegisterUseCase } from "../../domain/interface/useCaseInterface/auth/register.usecase.js";
import { RegisterClientUseCase } from "../../useCases/auth/register-user.useCase.js";
import { IPasswordHasher } from "../../domain/interface/useCaseInterface/auth/passwordHasher.interface.js";
import { HashPassword } from "../security/hashPassword.js";
import { IOtpService} from "../../domain/interface/servicesInterface/otp-service.interface.js";
import { OtpService } from "../../useCases/services/otp-service.js";
import { IEmailService } from "../../domain/interface/servicesInterface/email.service.interface.js";
import { EmailService } from "../../useCases/services/email.service.js";
import { sendOtpEmailUseCase } from "../../useCases/auth/send-otp-email.usecase.js";
import { ISendOtpEmailUseCase } from "../../domain/interface/useCaseInterface/auth/sent-otp-usecase.interface.js";
import { IVerifyOtpEmailUseCase } from "../../domain/interface/useCaseInterface/auth/verify-otp-usercase.interface.js";
import { VarifyOtpUseCase } from "../../useCases/auth/varify-otp-usecase.js";
import { ILoginUserUseCase } from "../../domain/interface/useCaseInterface/auth/login.usecase.interface.js";
import { LoginUserUseCase } from "../../useCases/auth/login-user.usecase.js";
import { ITokenService } from "../../domain/interface/servicesInterface/jwt-service.interface.js";
import { JWTService } from "../../useCases/services/jwt-service.js";
import { IGenerateTokenUseCase } from "../../domain/interface/useCaseInterface/auth/genarate-token-usecase.interface.js";
import { GenerateTokenUseCase } from "../../useCases/auth/genarate-token.usecase.js";
import { IUserExistenceService } from "../../domain/interface/servicesInterface/user-existence-service.interface.js";
import { UserExistenceService } from "../../useCases/services/user-existence.service.js";
import { IGoogleUseCase } from "../../domain/interface/useCaseInterface/auth/google-usecase.interface.js";
import { GoogleUseCase } from "../../useCases/auth/google-usecase.js";
import { SendEmailUseCase } from "../../useCases/common/send-email.usecase.js";
import { ISendEmailUseCase } from "../../domain/interface/useCaseInterface/common/send-email-usecase.interface.js";
import { IGetAllUsersUseCase } from "../../domain/interface/useCaseInterface/users/get-all-users-usecase.interface.js";
import { GetAllUserUseCase } from "../../useCases/users/get-all-users.usecase.js";
import { IUpdateUserStatusUseCase } from "../../domain/interface/useCaseInterface/users/update-user-status-usecase.interface.js";
import { UpdateUserStatusUseCase } from "../../useCases/users/update-user-status.usecase.js";
import { IGetAllVendorUseCase } from "../../domain/interface/useCaseInterface/vendor/get-all-vendor-usecase.interface.js";
import { GetAllVendorUseCase } from "../../useCases/vendor/get-all-vendor-usecase.js";
import { IUpdateVendorStatusUseCase } from "../../domain/interface/useCaseInterface/vendor/update-vendor-status-usecase.interface.js";
import { UpdateVendorStatusUseCase } from "../../useCases/vendor/update-vendor-status.usecase.js";
import { IRefreshTokenUseCase } from "../../domain/interface/useCaseInterface/auth/refresh-token-usecase.interface.js";
import { RefreshTokenUseCase } from "../../useCases/auth/refresh-token.usecase.js";
import { IGetUserDetailsUseCase } from "../../domain/interface/useCaseInterface/users/get-user-details-usecase.interface.js";
import { GetUserDetailsUseCase } from "../../useCases/users/get-user-details.usecase.js";
import { BlackListTokenUseCase } from "../../useCases/auth/blacklist-token.usecase.js";
import { IBlackListTokenUseCase } from "../../domain/interface/useCaseInterface/auth/blacklist-token-usecase.interface.js";
import { IRevokeRefreshTokenUseCase } from "../../domain/interface/useCaseInterface/auth/revok-refresh-token-usecase.interface.js";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/revoke-refresh-token.usecase.js";
import { IUpdateUserDetailsUseCase } from "../../domain/interface/useCaseInterface/users/update-user-details-usecase.interface.js";
import { UpdateUserDetailsUseCase} from "../../useCases/users/update-user-details.usecase.js";
import { IAddServiceUseCase } from "../../domain/interface/useCaseInterface/vendor/service/add-service-usecase.interface.js";
import { AddServiceUseCase } from "../../useCases/vendor/service/add-service.usecase.js";
import { IGetAllServicesUseCase } from "../../domain/interface/useCaseInterface/vendor/service/get-all-service-usecase.interface.js";
import { GetAllServiceUseCase } from "../../useCases/vendor/service/get-all-service.usecase.js";
import { ICategoryUseCase } from "../../domain/interface/useCaseInterface/admin/create-category-usecase.interface.js";
import { CategoryUseCase } from "../../useCases/admin/create-category-usecase.js";
import { IGetCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/get-category-usecase.interface.js";
import { GetAllCategoryUseCase } from "../../useCases/admin/get-all-category-usecase.js";
import { IUpdateStatusCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/update-category-usecase.interface.js";
import { UpdateStatusCategoryUseCase } from "../../useCases/admin/update-category-usecase.js";
import { IEditCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/edit-category-usecase.interface.js";
import { EditCategoryUseCase } from "../../useCases/admin/edit-category-usecase.js";
import { IEditServiceUseCase } from "../../domain/interface/useCaseInterface/vendor/service/edit-service-usecase.interface.js";
import { EditServiceUseCase } from "../../useCases/vendor/service/edit-service.usecase.js";
import { IUpdateServiceStatusUseCase } from "../../domain/interface/useCaseInterface/vendor/service/update-service-status-usecase.interface.js";
import { UpdateServiceStatusUseCase } from "../../useCases/vendor/service/update-status-service.usecase.js";
import { IGetServiceByIdUseCase } from "../../domain/interface/useCaseInterface/vendor/service/get-service-by-id-usecase.interface.js";
import { GetServiceByIdUseCase } from "../../useCases/vendor/service/get-service-by-id.usecase.js";
import { ICreateBookingUseCase } from "../../domain/interface/useCaseInterface/booking/create-booking-usecase.interface.js";
import { CreateBookingUseCase } from "../../useCases/booking/create-booking.usecase.js";
import { IGetAllBookingUseCase } from "../../domain/interface/useCaseInterface/booking/get-all-booking-usecase.interface.js";
import { GetAllBookingUseCase } from "../../useCases/booking/get-all-booking.usecase.js";
import { IUpdateBookingStatusUseCase } from "../../domain/interface/useCaseInterface/booking/update-booking-status-usecase.interface.js";
import { UpdateBookingStatusUseCase } from "../../useCases/booking/update-booking-status.usecase.js";
import { IChangePasswordUseCase } from "../../domain/interface/useCaseInterface/users/change-password-usecase.interface.js";
import { ChangePasswordUseCase } from "../../useCases/users/change-password-usecase.js";
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface.js";
import { PaymentService } from "../../useCases/services/payment.service.js";
import { compareSync } from "bcrypt";
import { IBookingPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-payment-usecase.interface.js";
import { BookingPaymentUseCase } from "../../useCases/booking/booking-payment.usecase.js";
import { ConfirmPaymentUseCase } from "../../useCases/booking/booking-confirm-payment.usecase.js";
import { IBookingConfirmPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-confirm-payment-usecase.interface.js";
import { ICreateEventUseCase } from "../../domain/interface/useCaseInterface/event/create-event-usecase.interface.js";
import { CreateEventUseCase } from "../../useCases/event/create-event.usecase.js";
import { IGetEventsByVendorIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-by-vendorId-usecase.interface.js";
import { GetEventsByVendorIdUseCase } from "../../useCases/event/get-events-by-vendorId.usecase.js";
import { IEditEventUseCase } from "../../domain/interface/useCaseInterface/event/edit-event-usecase.interface.js";
import { EditEventUseCase } from "../../useCases/event/edit-event.usecase.js";
import { IGetAllEventsUseCase } from "../../domain/interface/useCaseInterface/event/get-all-events-usecase.interface.js";
import { GetAllEventsUseCase } from "../../useCases/event/get-all-events.usecase.js";
import { IGetEventByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-event-by-id-usecase.interface.js";
import { GetEventByIdUseCase } from "../../useCases/event/get-event-by-id.usecase.js";
import { IQRService } from "../../domain/interface/servicesInterface/qr-service.interface.js";
import { QRService } from "../../useCases/services/qr-service.js";
import { ICreateTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/create-ticket-usecase.interface.js";
import { CreateTicketUseCase } from "../../useCases/ticket/create-ticket.usecase.js";
import { IConfirmTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/confirm-ticket-usecase.interface.js";
import { ConfirmTicketUseCase } from "../../useCases/ticket/confirm-ticket.usecase.js";
import { IGetAllTicketsByIdUseCase } from "../../domain/interface/useCaseInterface/ticket/get-all-tickets-by-id-usecase.interface.js";
import { GetAllTicketsByIdUseCase } from "../../useCases/ticket/get-all-tickets-by-id.usecase.js";
import { IGetWalletByIdUseCase } from "../../domain/interface/useCaseInterface/wallet/get-wallet-by-id-usecase.interface.js";
import { GetWalletByIdUseCase } from "../../useCases/wallet/get-wallet-by-id.usecase.js";
import { IVerifyTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/varify-ticket-usecase.inteface.js";
import { VerifyTicketUseCase } from "../../useCases/ticket/varifye-ticket.usecase.js";
import { IGetEventsAttendeesByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-attendees-by-id-usecase.interface.js";
import { GetEventsAttendeesByIdUseCase } from "../../useCases/event/get-events-attendees-by-id.usecase.js";
import { IForgotPasswordUseCase } from "../../domain/interface/useCaseInterface/auth/forgot-password-usecase.interface.js";
import { ForgotPasswordUseCase } from "../../useCases/auth/forgot-password.usecase.js";
import { IResetPasswordUseCase } from "../../domain/interface/useCaseInterface/auth/reset-password-usecase.interface.js";
import { ResetPasswordUseCase } from "../../useCases/auth/reset-password.usecase.js";
import { IAddWorkSampleUseCase } from "../../domain/interface/useCaseInterface/work-sample/add-work-sample-usecase.interface.js";
import { AddWorkSampleUseCase } from "../../useCases/work-sample/add-work-sample.usecase.js";
import { IUpdateWorkSampleUseCase } from "../../domain/interface/useCaseInterface/work-sample/update-work-sample-usecase.interface.js";
import { UpdateWorkSampleUseCase } from "../../useCases/work-sample/update-work-sample.usecase.js";
import { IAddReviewUseCase } from "../../domain/interface/useCaseInterface/review/add-review-usecase.interface.js";
import { AddReviewUseCase } from "../../useCases/review/add-review.usecase.js";
import { IGetAllReviewUseCase } from "../../domain/interface/useCaseInterface/review/get-all-review-usecase.interface.js";
import { GetAllReviewUseCase } from "../../useCases/review/get-all-review.usecase.js";
import { IGetAllWorkSampleByIdUseCase } from "../../domain/interface/useCaseInterface/work-sample/get-all-work-sample-by-id-usecase.interface.js";
import { GetAllWorkSampleByIdUseCase } from "../../useCases/work-sample/get-all-work-sample-by-id.usecase.js";
import { IGetAllDashboardDataUseCase } from "../../domain/interface/useCaseInterface/dashboard/get-all-dashboard-data-usecase.interface.js";
import { GetAllDashboardDataUseCase } from "../../useCases/dashboard/get-all-dashboard-data.usecase.js";
import { ICancelTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/cancel-ticket-usecase.interface.js";
import CancelTicketUseCase from "../../useCases/ticket/cancel-ticket.usecase.js";
import { ChatUseCase } from "../../useCases/chat/chat.usecase.js";
import { IChatUseCase } from "../../domain/interface/useCaseInterface/chat/chat-usecaes.interface.js";
import { ICancelBookingUseCase } from "../../domain/interface/useCaseInterface/booking/cancel-booking-usecase.interface.js";
import { CancelBookingUseCase } from "../../useCases/booking/cancel-booking-usecase.js";
import { ISaveFCMTokenUseCase } from "../../domain/interface/useCaseInterface/users/save-fcm-token-usecase.interface.js";
import { SaveFCMTokenUseCase } from "../../useCases/users/save-fcm-tocken.usecase.js";
import { IClearFCMTokenUseCase } from "../../domain/interface/useCaseInterface/auth/clear-fcm-token-usecase.interface.js";
import { ClearFCMTokenUseCase } from "../../useCases/auth/clear-fcm-token.usecase.js";
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface.js";
import {  pushNotificationService } from "../../useCases/services/firebase-push-notification.js";
import { IGetNotificationByIdUseCase } from "../../domain/interface/useCaseInterface/notification/get-notification-id-by-usecase-interface.js";
import { GetNotificationByIdUseCase } from "../../useCases/notification/get-notification-by-id-usecase.js";
import { IUpdateNotificationReadUseCase } from "../../domain/interface/useCaseInterface/notification/update-notificaton-read-usecase.interface.js";
import { register } from "module";
import { UpdateNotificationReadUseCase } from "../../useCases/notification/update-notification-read.usecase.js";
import { ICheckEventBookingAvliblityUseCase } from "../../domain/interface/useCaseInterface/event/check-event-booking-avliblity-usecase.interface.js";
import { CheckEventBookingAvliblityUseCase } from "../../useCases/event/check-event-booking-avliblity.usecase.js";
import { IBlockEventUseCase } from "../../domain/interface/useCaseInterface/event/block-event-usecase.interface.js";
import { BlockEventUseCase } from "../../useCases/event/block-event-usecase.js";



export class UseCaseRegistry {
   static registerUseCase(): void{

    // ======================= Auth ==========================//
     container.register<IRegisterUseCase>("IClientRegisterUseCase",{
       useClass: RegisterClientUseCase
     })
   
     container.register<ISendOtpEmailUseCase>("ISendOtpEmailUseCase",{
      useClass: sendOtpEmailUseCase
     })
    
     container.register<IVerifyOtpEmailUseCase>("IVerifyOtpEmailUseCase",{
      useClass: VarifyOtpUseCase
     })
    
     container.register<ILoginUserUseCase>("ILoginUserUseCase",{
      useClass: LoginUserUseCase
     })

     container.register<ITokenService>("ITokenService",{
       useClass: JWTService
     })

     container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase",{
      useClass: GenerateTokenUseCase
     })

     container.register<IGoogleUseCase>("IGoogleUseCase",{
      useClass: GoogleUseCase
     })

     container.register<IGetAllUsersUseCase>("IGetAllUsersUseCase",{
      useClass: GetAllUserUseCase
     })


     container.register<IUpdateUserStatusUseCase>("IUpdateUserStatusUseCase",{
       useClass: UpdateUserStatusUseCase
     })

     container.register<IGetAllVendorUseCase>("IGetAllVendorUseCase",{
      useClass: GetAllVendorUseCase
     })


     container.register<IUpdateVendorStatusUseCase>("IUpdateVendorStatusUseCase",{
      useClass: UpdateVendorStatusUseCase
     })


     container.register<IGetUserDetailsUseCase>("IGetUserDetailsUseCase",{
      useClass: GetUserDetailsUseCase
     })

     container.register<IBlackListTokenUseCase>("IBlackListTokenUseCase",{
      useClass: BlackListTokenUseCase
     })


     container.register<IRevokeRefreshTokenUseCase>("IRevokeRefreshTokenUseCase",{
      useClass: RevokeRefreshTokenUseCase
     })

     container.register<IUpdateUserDetailsUseCase>("IUpdateUserDetailsUseCase",{
      useClass: UpdateUserDetailsUseCase
     })

     container.register<IAddServiceUseCase>("IAddServiceUseCase",{
      useClass: AddServiceUseCase
     })

     container.register<IGetAllServicesUseCase>("IGetAllServicesUseCase",{
      useClass: GetAllServiceUseCase
     })

     container.register<ICategoryUseCase>("ICategoryUseCase",{
      useClass: CategoryUseCase
     })

     container.register<IGetCategoryUseCase>("IGetCategoryUseCase",{
      useClass: GetAllCategoryUseCase
     }) 

     container.register<IUpdateStatusCategoryUseCase>("IUpdateStatusCategoryUseCase",{
      useClass: UpdateStatusCategoryUseCase
     })    

     container.register<IEditCategoryUseCase>("IEditCategoryUseCase",{
      useClass: EditCategoryUseCase
     })     


     container.register<IEditServiceUseCase>("IEditServiceUseCase",{
      useClass: EditServiceUseCase
     }) 

     container.register<IUpdateServiceStatusUseCase>("IUpdateServiceStatusUseCase",{
      useClass: UpdateServiceStatusUseCase
     })   

     container.register<IGetServiceByIdUseCase>("IGetServiceByIdUseCase",{
      useClass: GetServiceByIdUseCase
     }) 

     container.register<ICreateBookingUseCase>("ICreateBookingUseCase",{
      useClass: CreateBookingUseCase
     })

     container.register<IGetAllBookingUseCase>("IGetAllBookingUseCase",{
      useClass: GetAllBookingUseCase
     })         

     container.register<IUpdateBookingStatusUseCase>("IUpdateBookingStatusUseCase",{
      useClass: UpdateBookingStatusUseCase  
     })

     container.register<IChangePasswordUseCase>("IChangePasswordUseCase",{
      useClass: ChangePasswordUseCase
     })

     container.register<IBookingPaymentUseCase>("IBookingPaymentUseCase",{
      useClass: BookingPaymentUseCase
     }) 

     container.register<IBookingConfirmPaymentUseCase>("IBookingConfirmPaymentUseCase",{
      useClass: ConfirmPaymentUseCase
     }) 

     container.register<ICreateEventUseCase>("ICreateEventUseCase",{
      useClass: CreateEventUseCase
     })   

     container.register<IGetEventsByVendorIdUseCase>("IGetEventsByVendorIdUseCase",{
      useClass: GetEventsByVendorIdUseCase
    })

     container.register<IEditEventUseCase>("IEditEventUseCase",{
      useClass: EditEventUseCase
    })    

    container.register<IGetAllEventsUseCase>("IGetAllEventsUseCase",{
      useClass: GetAllEventsUseCase
    })

    container.register<IGetEventByIdUseCase>("IGetEventByIdUseCase",{
      useClass: GetEventByIdUseCase
    })  


    container.register<ICreateTicketUseCase>("ICreateTicketUseCase",{
      useClass: CreateTicketUseCase
    })

    container.register<IConfirmTicketUseCase>("IConfirmTicketUseCase",{
      useClass: ConfirmTicketUseCase
    })


    container.register<IGetAllTicketsByIdUseCase>("IGetAllTicketsByIdUseCase",{
      useClass: GetAllTicketsByIdUseCase
    })

    container.register<IGetWalletByIdUseCase>("IGetWalletByIdUseCase",{
      useClass: GetWalletByIdUseCase
    })

    container.register<IVerifyTicketUseCase>("IVerifyTicketUseCase",{
      useClass: VerifyTicketUseCase
    })  
    
    container.register<IGetEventsAttendeesByIdUseCase>("IGetEventsAttendeesByIdUseCase",{
      useClass: GetEventsAttendeesByIdUseCase
    })  

    container.register<IForgotPasswordUseCase>("IForgotPasswordUseCase",{
      useClass: ForgotPasswordUseCase
    })

    container.register<IResetPasswordUseCase>("IResetPasswordUseCase",{
      useClass: ResetPasswordUseCase
    })

    container.register<IAddWorkSampleUseCase>("IAddWorkSampleUseCase",{
      useClass: AddWorkSampleUseCase
    })

    container.register<IUpdateWorkSampleUseCase>("IUpdateWorkSampleUseCase",{
      useClass: UpdateWorkSampleUseCase
    })

    container.register<IAddReviewUseCase>("IAddReviewUseCase",{
      useClass: AddReviewUseCase
    })

    container.register<IGetAllReviewUseCase>("IGetAllReviewUseCase",{
      useClass: GetAllReviewUseCase
    })

    container.register<IGetAllWorkSampleByIdUseCase>("IGetAllWorkSampleByIdUseCase",{
      useClass: GetAllWorkSampleByIdUseCase
    })

    container.register<IGetAllDashboardDataUseCase>("IGetAllDashboardDataUseCase",{
      useClass: GetAllDashboardDataUseCase
    })

    container.register<ICancelTicketUseCase>("ICancelTicketUseCase",{
      useClass: CancelTicketUseCase
    })

    container.register<IChatUseCase>("IChatUseCase",{
      useClass: ChatUseCase
    })

    container.register<ICancelBookingUseCase>("ICancelBookingUseCase",{
      useClass: CancelBookingUseCase
    })
    
    container.register<ISaveFCMTokenUseCase>("ISaveFCMTokenUseCase",{
      useClass: SaveFCMTokenUseCase
    })

    container.register<IClearFCMTokenUseCase>("IClearFCMTokenUseCase",{
      useClass: ClearFCMTokenUseCase
    })
    
   //======================= Register Bycripts =======================//

     container.register<IPasswordHasher>("IPasswordHasher",{
       useClass: HashPassword
     })









     //==================== Register Services =====================//
    container.register<IOtpService>("IOtpService",{
      useClass: OtpService
    })
    
    container.register<IEmailService>("IEmailService",{
      useClass: EmailService
    })

    container.register<IUserExistenceService>("IUserExistenceService",{
      useClass: UserExistenceService
    })

    container.register<ISendEmailUseCase>("ISendEmailUseCase",{
      useClass: SendEmailUseCase
    })

    container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase",{
       useClass: RefreshTokenUseCase
    })

    container.register<IPaymentService>("IPaymentService",{
      useClass: PaymentService
    })

    container.register<IQRService>("IQRService",{
      useClass: QRService
    })

    container.register<IPushNotificationService>("IPushNotificationService",{
      useClass: pushNotificationService
    })

    container.register<IGetNotificationByIdUseCase>("IGetNotificationByIdUseCase",{
      useClass: GetNotificationByIdUseCase
    })

    container.register<IUpdateNotificationReadUseCase>("IUpdateNotificationReadUseCase",{
      useClass: UpdateNotificationReadUseCase
    })

    container.register<ICheckEventBookingAvliblityUseCase>("ICheckEventBookingAvliblityUseCase",{
      useClass: CheckEventBookingAvliblityUseCase
    })

    container.register<IBlockEventUseCase>("IBlockEventUseCase",{
      useClass: BlockEventUseCase
    })

  
   }
}