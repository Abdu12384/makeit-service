import { container } from "tsyringe";
import { RegisterClientUseCase } from "../../useCases/auth/register-user.useCase.js";
import { HashPassword } from "../security/hashPassword.js";
import { OtpService } from "../../useCases/services/otp-service.js";
import { EmailService } from "../../useCases/services/email.service.js";
import { sendOtpEmailUseCase } from "../../useCases/auth/send-otp-email.usecase.js";
import { VarifyOtpUseCase } from "../../useCases/auth/varify-otp-usecase.js";
import { LoginUserUseCase } from "../../useCases/auth/login-user.usecase.js";
import { JWTService } from "../../useCases/services/jwt-service.js";
import { GenerateTokenUseCase } from "../../useCases/auth/genarate-token.usecase.js";
import { UserExistenceService } from "../../useCases/services/user-existence.service.js";
import { GoogleUseCase } from "../../useCases/auth/google-usecase.js";
import { SendEmailUseCase } from "../../useCases/common/send-email.usecase.js";
import { GetAllUserUseCase } from "../../useCases/users/get-all-users.usecase.js";
import { UpdateUserStatusUseCase } from "../../useCases/users/update-user-status.usecase.js";
import { GetAllVendorUseCase } from "../../useCases/vendor/get-all-vendor-usecase.js";
import { UpdateVendorStatusUseCase } from "../../useCases/vendor/update-vendor-status.usecase.js";
import { RefreshTokenUseCase } from "../../useCases/auth/refresh-token.usecase.js";
import { GetUserDetailsUseCase } from "../../useCases/users/get-user-details.usecase.js";
import { BlackListTokenUseCase } from "../../useCases/auth/blacklist-token.usecase.js";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/revoke-refresh-token.usecase.js";
import { UpdateUserDetailsUseCase } from "../../useCases/users/update-user-details.usecase.js";
import { AddServiceUseCase } from "../../useCases/vendor/service/add-service.usecase.js";
import { GetAllServiceUseCase } from "../../useCases/vendor/service/get-all-service.usecase.js";
import { CategoryUseCase } from "../../useCases/admin/create-category-usecase.js";
import { GetAllCategoryUseCase } from "../../useCases/admin/get-all-category-usecase.js";
import { UpdateStatusCategoryUseCase } from "../../useCases/admin/update-category-usecase.js";
import { EditCategoryUseCase } from "../../useCases/admin/edit-category-usecase.js";
import { EditServiceUseCase } from "../../useCases/vendor/service/edit-service.usecase.js";
import { UpdateServiceStatusUseCase } from "../../useCases/vendor/service/update-status-service.usecase.js";
import { GetServiceByIdUseCase } from "../../useCases/vendor/service/get-service-by-id.usecase.js";
import { CreateBookingUseCase } from "../../useCases/booking/create-booking.usecase.js";
import { GetAllBookingUseCase } from "../../useCases/booking/get-all-booking.usecase.js";
import { UpdateBookingStatusUseCase } from "../../useCases/booking/update-booking-status.usecase.js";
import { ChangePasswordUseCase } from "../../useCases/users/change-password-usecase.js";
import { PaymentService } from "../../useCases/services/payment.service.js";
import { BookingPaymentUseCase } from "../../useCases/booking/booking-payment.usecase.js";
import { ConfirmPaymentUseCase } from "../../useCases/booking/booking-confirm-payment.usecase.js";
import { CreateEventUseCase } from "../../useCases/event/create-event.usecase.js";
import { GetEventsByVendorIdUseCase } from "../../useCases/event/get-events-by-vendorId.usecase.js";
import { EditEventUseCase } from "../../useCases/event/edit-event.usecase.js";
import { GetAllEventsUseCase } from "../../useCases/event/get-all-events.usecase.js";
import { GetEventByIdUseCase } from "../../useCases/event/get-event-by-id.usecase.js";
import { QRService } from "../../useCases/services/qr-service.js";
import { CreateTicketUseCase } from "../../useCases/ticket/create-ticket.usecase.js";
import { ConfirmTicketUseCase } from "../../useCases/ticket/confirm-ticket.usecase.js";
import { GetAllTicketsByIdUseCase } from "../../useCases/ticket/get-all-tickets-by-id.usecase.js";
import { GetWalletByIdUseCase } from "../../useCases/wallet/get-wallet-by-id.usecase.js";
import { VerifyTicketUseCase } from "../../useCases/ticket/varifye-ticket.usecase.js";
import { GetEventsAttendeesByIdUseCase } from "../../useCases/event/get-events-attendees-by-id.usecase.js";
import { ForgotPasswordUseCase } from "../../useCases/auth/forgot-password.usecase.js";
import { ResetPasswordUseCase } from "../../useCases/auth/reset-password.usecase.js";
import { AddWorkSampleUseCase } from "../../useCases/work-sample/add-work-sample.usecase.js";
import { UpdateWorkSampleUseCase } from "../../useCases/work-sample/update-work-sample.usecase.js";
import { AddReviewUseCase } from "../../useCases/review/add-review.usecase.js";
import { GetAllReviewUseCase } from "../../useCases/review/get-all-review.usecase.js";
import { GetAllWorkSampleByIdUseCase } from "../../useCases/work-sample/get-all-work-sample-by-id.usecase.js";
import { GetAllDashboardDataUseCase } from "../../useCases/dashboard/get-all-dashboard-data.usecase.js";
import CancelTicketUseCase from "../../useCases/ticket/cancel-ticket.usecase.js";
import { ChatUseCase } from "../../useCases/chat/chat.usecase.js";
import { CancelBookingUseCase } from "../../useCases/booking/cancel-booking-usecase.js";
import { SaveFCMTokenUseCase } from "../../useCases/users/save-fcm-tocken.usecase.js";
import { ClearFCMTokenUseCase } from "../../useCases/auth/clear-fcm-token.usecase.js";
import { pushNotificationService } from "../../useCases/services/firebase-push-notification.js";
import { GetNotificationByIdUseCase } from "../../useCases/notification/get-notification-by-id-usecase.js";
import { UpdateNotificationReadUseCase } from "../../useCases/notification/update-notification-read.usecase.js";
export class UseCaseRegistry {
    static registerUseCase() {
        // ======================= Auth ==========================//
        container.register("IClientRegisterUseCase", {
            useClass: RegisterClientUseCase
        });
        container.register("ISendOtpEmailUseCase", {
            useClass: sendOtpEmailUseCase
        });
        container.register("IVerifyOtpEmailUseCase", {
            useClass: VarifyOtpUseCase
        });
        container.register("ILoginUserUseCase", {
            useClass: LoginUserUseCase
        });
        container.register("ITokenService", {
            useClass: JWTService
        });
        container.register("IGenerateTokenUseCase", {
            useClass: GenerateTokenUseCase
        });
        container.register("IGoogleUseCase", {
            useClass: GoogleUseCase
        });
        container.register("IGetAllUsersUseCase", {
            useClass: GetAllUserUseCase
        });
        container.register("IUpdateUserStatusUseCase", {
            useClass: UpdateUserStatusUseCase
        });
        container.register("IGetAllVendorUseCase", {
            useClass: GetAllVendorUseCase
        });
        container.register("IUpdateVendorStatusUseCase", {
            useClass: UpdateVendorStatusUseCase
        });
        container.register("IGetUserDetailsUseCase", {
            useClass: GetUserDetailsUseCase
        });
        container.register("IBlackListTokenUseCase", {
            useClass: BlackListTokenUseCase
        });
        container.register("IRevokeRefreshTokenUseCase", {
            useClass: RevokeRefreshTokenUseCase
        });
        container.register("IUpdateUserDetailsUseCase", {
            useClass: UpdateUserDetailsUseCase
        });
        container.register("IAddServiceUseCase", {
            useClass: AddServiceUseCase
        });
        container.register("IGetAllServicesUseCase", {
            useClass: GetAllServiceUseCase
        });
        container.register("ICategoryUseCase", {
            useClass: CategoryUseCase
        });
        container.register("IGetCategoryUseCase", {
            useClass: GetAllCategoryUseCase
        });
        container.register("IUpdateStatusCategoryUseCase", {
            useClass: UpdateStatusCategoryUseCase
        });
        container.register("IEditCategoryUseCase", {
            useClass: EditCategoryUseCase
        });
        container.register("IEditServiceUseCase", {
            useClass: EditServiceUseCase
        });
        container.register("IUpdateServiceStatusUseCase", {
            useClass: UpdateServiceStatusUseCase
        });
        container.register("IGetServiceByIdUseCase", {
            useClass: GetServiceByIdUseCase
        });
        container.register("ICreateBookingUseCase", {
            useClass: CreateBookingUseCase
        });
        container.register("IGetAllBookingUseCase", {
            useClass: GetAllBookingUseCase
        });
        container.register("IUpdateBookingStatusUseCase", {
            useClass: UpdateBookingStatusUseCase
        });
        container.register("IChangePasswordUseCase", {
            useClass: ChangePasswordUseCase
        });
        container.register("IBookingPaymentUseCase", {
            useClass: BookingPaymentUseCase
        });
        container.register("IBookingConfirmPaymentUseCase", {
            useClass: ConfirmPaymentUseCase
        });
        container.register("ICreateEventUseCase", {
            useClass: CreateEventUseCase
        });
        container.register("IGetEventsByVendorIdUseCase", {
            useClass: GetEventsByVendorIdUseCase
        });
        container.register("IEditEventUseCase", {
            useClass: EditEventUseCase
        });
        container.register("IGetAllEventsUseCase", {
            useClass: GetAllEventsUseCase
        });
        container.register("IGetEventByIdUseCase", {
            useClass: GetEventByIdUseCase
        });
        container.register("ICreateTicketUseCase", {
            useClass: CreateTicketUseCase
        });
        container.register("IConfirmTicketUseCase", {
            useClass: ConfirmTicketUseCase
        });
        container.register("IGetAllTicketsByIdUseCase", {
            useClass: GetAllTicketsByIdUseCase
        });
        container.register("IGetWalletByIdUseCase", {
            useClass: GetWalletByIdUseCase
        });
        container.register("IVerifyTicketUseCase", {
            useClass: VerifyTicketUseCase
        });
        container.register("IGetEventsAttendeesByIdUseCase", {
            useClass: GetEventsAttendeesByIdUseCase
        });
        container.register("IForgotPasswordUseCase", {
            useClass: ForgotPasswordUseCase
        });
        container.register("IResetPasswordUseCase", {
            useClass: ResetPasswordUseCase
        });
        container.register("IAddWorkSampleUseCase", {
            useClass: AddWorkSampleUseCase
        });
        container.register("IUpdateWorkSampleUseCase", {
            useClass: UpdateWorkSampleUseCase
        });
        container.register("IAddReviewUseCase", {
            useClass: AddReviewUseCase
        });
        container.register("IGetAllReviewUseCase", {
            useClass: GetAllReviewUseCase
        });
        container.register("IGetAllWorkSampleByIdUseCase", {
            useClass: GetAllWorkSampleByIdUseCase
        });
        container.register("IGetAllDashboardDataUseCase", {
            useClass: GetAllDashboardDataUseCase
        });
        container.register("ICancelTicketUseCase", {
            useClass: CancelTicketUseCase
        });
        container.register("IChatUseCase", {
            useClass: ChatUseCase
        });
        container.register("ICancelBookingUseCase", {
            useClass: CancelBookingUseCase
        });
        container.register("ISaveFCMTokenUseCase", {
            useClass: SaveFCMTokenUseCase
        });
        container.register("IClearFCMTokenUseCase", {
            useClass: ClearFCMTokenUseCase
        });
        //======================= Register Bycripts =======================//
        container.register("IPasswordHasher", {
            useClass: HashPassword
        });
        //==================== Register Services =====================//
        container.register("IOtpService", {
            useClass: OtpService
        });
        container.register("IEmailService", {
            useClass: EmailService
        });
        container.register("IUserExistenceService", {
            useClass: UserExistenceService
        });
        container.register("ISendEmailUseCase", {
            useClass: SendEmailUseCase
        });
        container.register("IRefreshTokenUseCase", {
            useClass: RefreshTokenUseCase
        });
        container.register("IPaymentService", {
            useClass: PaymentService
        });
        container.register("IQRService", {
            useClass: QRService
        });
        container.register("IPushNotificationService", {
            useClass: pushNotificationService
        });
        container.register("IGetNotificationByIdUseCase", {
            useClass: GetNotificationByIdUseCase
        });
        container.register("IUpdateNotificationReadUseCase", {
            useClass: UpdateNotificationReadUseCase
        });
    }
}
//# sourceMappingURL=useCase.registry.js.map