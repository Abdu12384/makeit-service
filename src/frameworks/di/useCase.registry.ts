import { container } from "tsyringe";
import { IRegisterUseCase } from "../../domain/interface/useCaseInterface/auth/register.usecase";
import { RegisterClientUseCase } from "../../useCases/auth/register-user.useCase";
import { IPasswordHasher } from "../../domain/interface/useCaseInterface/auth/passwordHasher.interface";
import { HashPassword } from "../security/hashPassword";
import { IOtpService} from "../../domain/interface/servicesInterface/otp-service.interface";
import { OtpService } from "../../useCases/services/otp-service";
import { IEmailService } from "../../domain/interface/servicesInterface/email.service.interface";
import { EmailService } from "../../useCases/services/email.service";
import { sendOtpEmailUseCase } from "../../useCases/auth/send-otp-email.usecase";
import { ISendOtpEmailUseCase } from "../../domain/interface/useCaseInterface/auth/sent-otp-usecase.interface";
import { IVerifyOtpEmailUseCase } from "../../domain/interface/useCaseInterface/auth/verify-otp-usercase.interface";
import { VarifyOtpUseCase } from "../../useCases/auth/varify-otp-usecase";
import { ILoginUserUseCase } from "../../domain/interface/useCaseInterface/auth/login.usecase.interface";
import { LoginUserUseCase } from "../../useCases/auth/login-user.usecase";
import { ITokenService } from "../../domain/interface/servicesInterface/jwt-service.interface";
import { JWTService } from "../../useCases/services/jwt-service";
import { IGenerateTokenUseCase } from "../../domain/interface/useCaseInterface/auth/genarate-token-usecase.interface";
import { GenerateTokenUseCase } from "../../useCases/auth/genarate-token.usecase";
import { IUserExistenceService } from "../../domain/interface/servicesInterface/user-existence-service.interface";
import { UserExistenceService } from "../../useCases/services/user-existence.service";
import { IGoogleUseCase } from "../../domain/interface/useCaseInterface/auth/google-usecase.interface";
import { GoogleUseCase } from "../../useCases/auth/google-usecase";
import { SendEmailUseCase } from "../../useCases/common/send-email.usecase";
import { ISendEmailUseCase } from "../../domain/interface/useCaseInterface/common/send-email-usecase.interface";
import { IGetAllUsersUseCase } from "../../domain/interface/useCaseInterface/users/get-all-users-usecase.interface";
import { GetAllUserUseCase } from "../../useCases/users/get-all-users.usecase";
import { IUpdateUserStatusUseCase } from "../../domain/interface/useCaseInterface/users/update-user-status-usecase.interface";
import { UpdateUserStatusUseCase } from "../../useCases/users/update-user-status.usecase";
import { IGetAllVendorUseCase } from "../../domain/interface/useCaseInterface/vendor/get-all-vendor-usecase.interface";
import { GetAllVendorUseCase } from "../../useCases/vendor/get-all-vendor-usecase";
import { IUpdateVendorStatusUseCase } from "../../domain/interface/useCaseInterface/vendor/update-vendor-status-usecase.interface";
import { UpdateVendorStatusUseCase } from "../../useCases/vendor/update-vendor-status.usecase";
import { IRefreshTokenUseCase } from "../../domain/interface/useCaseInterface/auth/refresh-token-usecase.interface";
import { RefreshTokenUseCase } from "../../useCases/auth/refresh-token.usecase";
import { IGetUserDetailsUseCase } from "../../domain/interface/useCaseInterface/users/get-user-details-usecase.interface";
import { GetUserDetailsUseCase } from "../../useCases/users/get-user-details.usecase";
import { BlackListTokenUseCase } from "../../useCases/auth/blacklist-token.usecase";
import { IBlackListTokenUseCase } from "../../domain/interface/useCaseInterface/auth/blacklist-token-usecase.interface";
import { IRevokeRefreshTokenUseCase } from "../../domain/interface/useCaseInterface/auth/revok-refresh-token-usecase.interface";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/revoke-refresh-token.usecase";
import { IUpdateUserDetailsUseCase } from "../../domain/interface/useCaseInterface/users/update-user-details-usecase.interface";
import { UpdateUserDetailsUseCase} from "../../useCases/users/update-user-details.usecase";
import { IAddServiceUseCase } from "../../domain/interface/useCaseInterface/vendor/service/add-service-usecase.interface";
import { AddServiceUseCase } from "../../useCases/vendor/service/add-service.usecase";
import { IGetAllServicesUseCase } from "../../domain/interface/useCaseInterface/vendor/service/get-all-service-usecase.interface";
import { GetAllServiceUseCase } from "../../useCases/vendor/service/get-all-service.usecase";
import { ICategoryUseCase } from "../../domain/interface/useCaseInterface/admin/create-category-usecase.interface";
import { CategoryUseCase } from "../../useCases/admin/create-category-usecase";
import { IGetCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/get-category-usecase.interface";
import { GetAllCategoryUseCase } from "../../useCases/admin/get-all-category-usecase";
import { IUpdateStatusCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/update-category-usecase.interface";
import { UpdateStatusCategoryUseCase } from "../../useCases/admin/update-category-usecase";
import { IEditCategoryUseCase } from "../../domain/interface/useCaseInterface/admin/edit-category-usecase.interface";
import { EditCategoryUseCase } from "../../useCases/admin/edit-category-usecase";
import { IEditServiceUseCase } from "../../domain/interface/useCaseInterface/vendor/service/edit-service-usecase.interface";
import { EditServiceUseCase } from "../../useCases/vendor/service/edit-service.usecase";
import { IUpdateServiceStatusUseCase } from "../../domain/interface/useCaseInterface/vendor/service/update-service-status-usecase.interface";
import { UpdateServiceStatusUseCase } from "../../useCases/vendor/service/update-status-service.usecase";
import { IGetServiceByIdUseCase } from "../../domain/interface/useCaseInterface/vendor/service/get-service-by-id-usecase.interface";
import { GetServiceByIdUseCase } from "../../useCases/vendor/service/get-service-by-id.usecase";
import { ICreateBookingUseCase } from "../../domain/interface/useCaseInterface/booking/create-booking-usecase.interface";
import { CreateBookingUseCase } from "../../useCases/booking/create-booking.usecase";
import { IGetAllBookingUseCase } from "../../domain/interface/useCaseInterface/booking/get-all-booking-usecase.interface";
import { GetAllBookingUseCase } from "../../useCases/booking/get-all-booking.usecase";
import { IUpdateBookingStatusUseCase } from "../../domain/interface/useCaseInterface/booking/update-booking-status-usecase.interface";
import { UpdateBookingStatusUseCase } from "../../useCases/booking/update-booking-status.usecase";
import { IChangePasswordUseCase } from "../../domain/interface/useCaseInterface/users/change-password-usecase.interface";
import { ChangePasswordUseCase } from "../../useCases/users/change-password-usecase";
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface";
import { PaymentService } from "../../useCases/services/payment.service";
import { IBookingPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-payment-usecase.interface";
import { BookingPaymentUseCase } from "../../useCases/booking/booking-payment.usecase";
import { ConfirmPaymentUseCase } from "../../useCases/booking/booking-confirm-payment.usecase";
import { IBookingConfirmPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-confirm-payment-usecase.interface";
import { ICreateEventUseCase } from "../../domain/interface/useCaseInterface/event/create-event-usecase.interface";
import { CreateEventUseCase } from "../../useCases/event/create-event.usecase";
import { IGetEventsByVendorIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-by-vendorId-usecase.interface";
import { GetEventsByVendorIdUseCase } from "../../useCases/event/get-events-by-vendorId.usecase";
import { IEditEventUseCase } from "../../domain/interface/useCaseInterface/event/edit-event-usecase.interface";
import { EditEventUseCase } from "../../useCases/event/edit-event.usecase";
import { IGetAllEventsUseCase } from "../../domain/interface/useCaseInterface/event/get-all-events-usecase.interface";
import { GetAllEventsUseCase } from "../../useCases/event/get-all-events.usecase";
import { IGetEventByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-event-by-id-usecase.interface";
import { GetEventByIdUseCase } from "../../useCases/event/get-event-by-id.usecase";
import { IQRService } from "../../domain/interface/servicesInterface/qr-service.interface";
import { QRService } from "../../useCases/services/qr-service";
import { ICreateTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/create-ticket-usecase.interface";
import { CreateTicketUseCase } from "../../useCases/ticket/create-ticket.usecase";
import { IConfirmTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/confirm-ticket-usecase.interface";
import { ConfirmTicketUseCase } from "../../useCases/ticket/confirm-ticket.usecase";
import { IGetAllTicketsByIdUseCase } from "../../domain/interface/useCaseInterface/ticket/get-all-tickets-by-id-usecase.interface";
import { GetAllTicketsByIdUseCase } from "../../useCases/ticket/get-all-tickets-by-id.usecase";
import { IGetWalletByIdUseCase } from "../../domain/interface/useCaseInterface/wallet/get-wallet-by-id-usecase.interface";
import { GetWalletByIdUseCase } from "../../useCases/wallet/get-wallet-by-id.usecase";
import { IVerifyTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/varify-ticket-usecase.inteface";
import { VerifyTicketUseCase } from "../../useCases/ticket/varifye-ticket.usecase";
import { IGetEventsAttendeesByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-attendees-by-id-usecase.interface";
import { GetEventsAttendeesByIdUseCase } from "../../useCases/event/get-events-attendees-by-id.usecase";
import { IForgotPasswordUseCase } from "../../domain/interface/useCaseInterface/auth/forgot-password-usecase.interface";
import { ForgotPasswordUseCase } from "../../useCases/auth/forgot-password.usecase";
import { IResetPasswordUseCase } from "../../domain/interface/useCaseInterface/auth/reset-password-usecase.interface";
import { ResetPasswordUseCase } from "../../useCases/auth/reset-password.usecase";
import { IAddWorkSampleUseCase } from "../../domain/interface/useCaseInterface/work-sample/add-work-sample-usecase.interface";
import { AddWorkSampleUseCase } from "../../useCases/work-sample/add-work-sample.usecase";
import { IUpdateWorkSampleUseCase } from "../../domain/interface/useCaseInterface/work-sample/update-work-sample-usecase.interface";
import { UpdateWorkSampleUseCase } from "../../useCases/work-sample/update-work-sample.usecase";
import { IAddReviewUseCase } from "../../domain/interface/useCaseInterface/review/add-review-usecase.interface";
import { AddReviewUseCase } from "../../useCases/review/add-review.usecase";
import { IGetAllReviewUseCase } from "../../domain/interface/useCaseInterface/review/get-all-review-usecase.interface";
import { GetAllReviewUseCase } from "../../useCases/review/get-all-review.usecase";
import { IGetAllWorkSampleByIdUseCase } from "../../domain/interface/useCaseInterface/work-sample/get-all-work-sample-by-id-usecase.interface";
import { GetAllWorkSampleByIdUseCase } from "../../useCases/work-sample/get-all-work-sample-by-id.usecase";
import { IGetAllDashboardDataUseCase } from "../../domain/interface/useCaseInterface/dashboard/get-all-dashboard-data-usecase.interface";
import { GetAllDashboardDataUseCase } from "../../useCases/dashboard/get-all-dashboard-data.usecase";
import { ICancelTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/cancel-ticket-usecase.interface";
import CancelTicketUseCase from "../../useCases/ticket/cancel-ticket.usecase";
import { ChatUseCase } from "../../useCases/chat/chat.usecase";
import { IChatUseCase } from "../../domain/interface/useCaseInterface/chat/chat-usecaes.interface";
import { ICancelBookingUseCase } from "../../domain/interface/useCaseInterface/booking/cancel-booking-usecase.interface";
import { CancelBookingUseCase } from "../../useCases/booking/cancel-booking-usecase";
import { ISaveFCMTokenUseCase } from "../../domain/interface/useCaseInterface/users/save-fcm-token-usecase.interface";
import { SaveFCMTokenUseCase } from "../../useCases/users/save-fcm-tocken.usecase";
import { IClearFCMTokenUseCase } from "../../domain/interface/useCaseInterface/auth/clear-fcm-token-usecase.interface";
import { ClearFCMTokenUseCase } from "../../useCases/auth/clear-fcm-token.usecase";
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface";
import {  pushNotificationService } from "../../useCases/services/firebase-push-notification";
import { IGetNotificationByIdUseCase } from "../../domain/interface/useCaseInterface/notification/get-notification-id-by-usecase-interface";
import { GetNotificationByIdUseCase } from "../../useCases/notification/get-notification-by-id-usecase";
import { IUpdateNotificationReadUseCase } from "../../domain/interface/useCaseInterface/notification/update-notificaton-read-usecase.interface";
import { UpdateNotificationReadUseCase } from "../../useCases/notification/update-notification-read.usecase";
import { ICheckEventBookingAvliblityUseCase } from "../../domain/interface/useCaseInterface/event/check-event-booking-avliblity-usecase.interface";
import { CheckEventBookingAvliblityUseCase } from "../../useCases/event/check-event-booking-avliblity.usecase";
import { IBlockEventUseCase } from "../../domain/interface/useCaseInterface/event/block-event-usecase.interface";
import { BlockEventUseCase } from "../../useCases/event/block-event-usecase";
import { IRescheduleBookingUseCase } from "../../domain/interface/useCaseInterface/booking/resudule-booking-usecase.interface";
import { RescheduleBookingUseCase } from "../../useCases/booking/resedul-booking.usecase";
import { IGetVendorBookedDatesUseCase } from "../../domain/interface/useCaseInterface/booking/get-vendor-booked-dates-usecase.interface";
import { GetVendorBookedDatesUseCase } from "../../useCases/booking/get-vendor-booked-dates.usecase";
import { IGetAllEventsByLocationUseCase } from "../../domain/interface/useCaseInterface/event/get-all-events-by-location-usecase.interface";
import { GetAllEventsByLocationUseCase } from "../../useCases/event/get-all-events-by-location";



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

    container.register<IGetVendorBookedDatesUseCase>("IGetVendorBookedDatesUseCase",{
      useClass: GetVendorBookedDatesUseCase
    })

    container.register<IGetAllEventsByLocationUseCase>("IGetAllEventsByLocationUseCase",{
      useClass: GetAllEventsByLocationUseCase
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

    container.register<IRescheduleBookingUseCase>("IRescheduleBookingUseCase",{
      useClass: RescheduleBookingUseCase
    })

  
   }
}