"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCaseRegistry = void 0;
const tsyringe_1 = require("tsyringe");
const register_user_useCase_1 = require("../../useCases/auth/register-user.useCase");
const hashPassword_1 = require("../security/hashPassword");
const otp_service_1 = require("../../useCases/services/otp-service");
const email_service_1 = require("../../useCases/services/email.service");
const send_otp_email_usecase_1 = require("../../useCases/auth/send-otp-email.usecase");
const varify_otp_usecase_1 = require("../../useCases/auth/varify-otp-usecase");
const login_user_usecase_1 = require("../../useCases/auth/login-user.usecase");
const jwt_service_1 = require("../../useCases/services/jwt-service");
const genarate_token_usecase_1 = require("../../useCases/auth/genarate-token.usecase");
const user_existence_service_1 = require("../../useCases/services/user-existence.service");
const google_usecase_1 = require("../../useCases/auth/google-usecase");
const send_email_usecase_1 = require("../../useCases/common/send-email.usecase");
const get_all_users_usecase_1 = require("../../useCases/users/get-all-users.usecase");
const update_user_status_usecase_1 = require("../../useCases/users/update-user-status.usecase");
const get_all_vendor_usecase_1 = require("../../useCases/vendor/get-all-vendor-usecase");
const update_vendor_status_usecase_1 = require("../../useCases/vendor/update-vendor-status.usecase");
const refresh_token_usecase_1 = require("../../useCases/auth/refresh-token.usecase");
const get_user_details_usecase_1 = require("../../useCases/users/get-user-details.usecase");
const blacklist_token_usecase_1 = require("../../useCases/auth/blacklist-token.usecase");
const revoke_refresh_token_usecase_1 = require("../../useCases/auth/revoke-refresh-token.usecase");
const update_user_details_usecase_1 = require("../../useCases/users/update-user-details.usecase");
const add_service_usecase_1 = require("../../useCases/vendor/service/add-service.usecase");
const get_all_service_usecase_1 = require("../../useCases/vendor/service/get-all-service.usecase");
const create_category_usecase_1 = require("../../useCases/admin/create-category-usecase");
const get_all_category_usecase_1 = require("../../useCases/admin/get-all-category-usecase");
const update_category_usecase_1 = require("../../useCases/admin/update-category-usecase");
const edit_category_usecase_1 = require("../../useCases/admin/edit-category-usecase");
const edit_service_usecase_1 = require("../../useCases/vendor/service/edit-service.usecase");
const update_status_service_usecase_1 = require("../../useCases/vendor/service/update-status-service.usecase");
const get_service_by_id_usecase_1 = require("../../useCases/vendor/service/get-service-by-id.usecase");
const create_booking_usecase_1 = require("../../useCases/booking/create-booking.usecase");
const get_all_booking_usecase_1 = require("../../useCases/booking/get-all-booking.usecase");
const update_booking_status_usecase_1 = require("../../useCases/booking/update-booking-status.usecase");
const change_password_usecase_1 = require("../../useCases/users/change-password-usecase");
const payment_service_1 = require("../../useCases/services/payment.service");
const booking_payment_usecase_1 = require("../../useCases/booking/booking-payment.usecase");
const booking_confirm_payment_usecase_1 = require("../../useCases/booking/booking-confirm-payment.usecase");
const create_event_usecase_1 = require("../../useCases/event/create-event.usecase");
const get_events_by_vendorId_usecase_1 = require("../../useCases/event/get-events-by-vendorId.usecase");
const edit_event_usecase_1 = require("../../useCases/event/edit-event.usecase");
const get_all_events_usecase_1 = require("../../useCases/event/get-all-events.usecase");
const get_event_by_id_usecase_1 = require("../../useCases/event/get-event-by-id.usecase");
const qr_service_1 = require("../../useCases/services/qr-service");
const create_ticket_usecase_1 = require("../../useCases/ticket/create-ticket.usecase");
const confirm_ticket_usecase_1 = require("../../useCases/ticket/confirm-ticket.usecase");
const get_all_tickets_by_id_usecase_1 = require("../../useCases/ticket/get-all-tickets-by-id.usecase");
const get_wallet_by_id_usecase_1 = require("../../useCases/wallet/get-wallet-by-id.usecase");
const varifye_ticket_usecase_1 = require("../../useCases/ticket/varifye-ticket.usecase");
const get_events_attendees_by_id_usecase_1 = require("../../useCases/event/get-events-attendees-by-id.usecase");
const forgot_password_usecase_1 = require("../../useCases/auth/forgot-password.usecase");
const reset_password_usecase_1 = require("../../useCases/auth/reset-password.usecase");
const add_work_sample_usecase_1 = require("../../useCases/work-sample/add-work-sample.usecase");
const update_work_sample_usecase_1 = require("../../useCases/work-sample/update-work-sample.usecase");
const add_review_usecase_1 = require("../../useCases/review/add-review.usecase");
const get_all_review_usecase_1 = require("../../useCases/review/get-all-review.usecase");
const get_all_work_sample_by_id_usecase_1 = require("../../useCases/work-sample/get-all-work-sample-by-id.usecase");
const get_all_dashboard_data_usecase_1 = require("../../useCases/dashboard/get-all-dashboard-data.usecase");
const cancel_ticket_usecase_1 = __importDefault(require("../../useCases/ticket/cancel-ticket.usecase"));
const chat_usecase_1 = require("../../useCases/chat/chat.usecase");
const cancel_booking_usecase_1 = require("../../useCases/booking/cancel-booking-usecase");
const save_fcm_tocken_usecase_1 = require("../../useCases/users/save-fcm-tocken.usecase");
const clear_fcm_token_usecase_1 = require("../../useCases/auth/clear-fcm-token.usecase");
const firebase_push_notification_1 = require("../../useCases/services/firebase-push-notification");
const get_notification_by_id_usecase_1 = require("../../useCases/notification/get-notification-by-id-usecase");
const update_notification_read_usecase_1 = require("../../useCases/notification/update-notification-read.usecase");
const check_event_booking_avliblity_usecase_1 = require("../../useCases/event/check-event-booking-avliblity.usecase");
const block_event_usecase_1 = require("../../useCases/event/block-event-usecase");
const resedul_booking_usecase_1 = require("../../useCases/booking/resedul-booking.usecase");
const get_vendor_booked_dates_usecase_1 = require("../../useCases/booking/get-vendor-booked-dates.usecase");
const get_all_events_by_location_1 = require("../../useCases/event/get-all-events-by-location");
class UseCaseRegistry {
    static registerUseCase() {
        // ======================= Auth ==========================//
        tsyringe_1.container.register("IClientRegisterUseCase", {
            useClass: register_user_useCase_1.RegisterClientUseCase
        });
        tsyringe_1.container.register("ISendOtpEmailUseCase", {
            useClass: send_otp_email_usecase_1.sendOtpEmailUseCase
        });
        tsyringe_1.container.register("IVerifyOtpEmailUseCase", {
            useClass: varify_otp_usecase_1.VarifyOtpUseCase
        });
        tsyringe_1.container.register("ILoginUserUseCase", {
            useClass: login_user_usecase_1.LoginUserUseCase
        });
        tsyringe_1.container.register("ITokenService", {
            useClass: jwt_service_1.JWTService
        });
        tsyringe_1.container.register("IGenerateTokenUseCase", {
            useClass: genarate_token_usecase_1.GenerateTokenUseCase
        });
        tsyringe_1.container.register("IGoogleUseCase", {
            useClass: google_usecase_1.GoogleUseCase
        });
        tsyringe_1.container.register("IGetAllUsersUseCase", {
            useClass: get_all_users_usecase_1.GetAllUserUseCase
        });
        tsyringe_1.container.register("IUpdateUserStatusUseCase", {
            useClass: update_user_status_usecase_1.UpdateUserStatusUseCase
        });
        tsyringe_1.container.register("IGetAllVendorUseCase", {
            useClass: get_all_vendor_usecase_1.GetAllVendorUseCase
        });
        tsyringe_1.container.register("IUpdateVendorStatusUseCase", {
            useClass: update_vendor_status_usecase_1.UpdateVendorStatusUseCase
        });
        tsyringe_1.container.register("IGetUserDetailsUseCase", {
            useClass: get_user_details_usecase_1.GetUserDetailsUseCase
        });
        tsyringe_1.container.register("IBlackListTokenUseCase", {
            useClass: blacklist_token_usecase_1.BlackListTokenUseCase
        });
        tsyringe_1.container.register("IRevokeRefreshTokenUseCase", {
            useClass: revoke_refresh_token_usecase_1.RevokeRefreshTokenUseCase
        });
        tsyringe_1.container.register("IUpdateUserDetailsUseCase", {
            useClass: update_user_details_usecase_1.UpdateUserDetailsUseCase
        });
        tsyringe_1.container.register("IAddServiceUseCase", {
            useClass: add_service_usecase_1.AddServiceUseCase
        });
        tsyringe_1.container.register("IGetAllServicesUseCase", {
            useClass: get_all_service_usecase_1.GetAllServiceUseCase
        });
        tsyringe_1.container.register("ICategoryUseCase", {
            useClass: create_category_usecase_1.CategoryUseCase
        });
        tsyringe_1.container.register("IGetCategoryUseCase", {
            useClass: get_all_category_usecase_1.GetAllCategoryUseCase
        });
        tsyringe_1.container.register("IUpdateStatusCategoryUseCase", {
            useClass: update_category_usecase_1.UpdateStatusCategoryUseCase
        });
        tsyringe_1.container.register("IEditCategoryUseCase", {
            useClass: edit_category_usecase_1.EditCategoryUseCase
        });
        tsyringe_1.container.register("IEditServiceUseCase", {
            useClass: edit_service_usecase_1.EditServiceUseCase
        });
        tsyringe_1.container.register("IUpdateServiceStatusUseCase", {
            useClass: update_status_service_usecase_1.UpdateServiceStatusUseCase
        });
        tsyringe_1.container.register("IGetServiceByIdUseCase", {
            useClass: get_service_by_id_usecase_1.GetServiceByIdUseCase
        });
        tsyringe_1.container.register("ICreateBookingUseCase", {
            useClass: create_booking_usecase_1.CreateBookingUseCase
        });
        tsyringe_1.container.register("IGetAllBookingUseCase", {
            useClass: get_all_booking_usecase_1.GetAllBookingUseCase
        });
        tsyringe_1.container.register("IUpdateBookingStatusUseCase", {
            useClass: update_booking_status_usecase_1.UpdateBookingStatusUseCase
        });
        tsyringe_1.container.register("IChangePasswordUseCase", {
            useClass: change_password_usecase_1.ChangePasswordUseCase
        });
        tsyringe_1.container.register("IBookingPaymentUseCase", {
            useClass: booking_payment_usecase_1.BookingPaymentUseCase
        });
        tsyringe_1.container.register("IBookingConfirmPaymentUseCase", {
            useClass: booking_confirm_payment_usecase_1.ConfirmPaymentUseCase
        });
        tsyringe_1.container.register("ICreateEventUseCase", {
            useClass: create_event_usecase_1.CreateEventUseCase
        });
        tsyringe_1.container.register("IGetEventsByVendorIdUseCase", {
            useClass: get_events_by_vendorId_usecase_1.GetEventsByVendorIdUseCase
        });
        tsyringe_1.container.register("IEditEventUseCase", {
            useClass: edit_event_usecase_1.EditEventUseCase
        });
        tsyringe_1.container.register("IGetAllEventsUseCase", {
            useClass: get_all_events_usecase_1.GetAllEventsUseCase
        });
        tsyringe_1.container.register("IGetEventByIdUseCase", {
            useClass: get_event_by_id_usecase_1.GetEventByIdUseCase
        });
        tsyringe_1.container.register("ICreateTicketUseCase", {
            useClass: create_ticket_usecase_1.CreateTicketUseCase
        });
        tsyringe_1.container.register("IConfirmTicketUseCase", {
            useClass: confirm_ticket_usecase_1.ConfirmTicketUseCase
        });
        tsyringe_1.container.register("IGetAllTicketsByIdUseCase", {
            useClass: get_all_tickets_by_id_usecase_1.GetAllTicketsByIdUseCase
        });
        tsyringe_1.container.register("IGetWalletByIdUseCase", {
            useClass: get_wallet_by_id_usecase_1.GetWalletByIdUseCase
        });
        tsyringe_1.container.register("IVerifyTicketUseCase", {
            useClass: varifye_ticket_usecase_1.VerifyTicketUseCase
        });
        tsyringe_1.container.register("IGetEventsAttendeesByIdUseCase", {
            useClass: get_events_attendees_by_id_usecase_1.GetEventsAttendeesByIdUseCase
        });
        tsyringe_1.container.register("IForgotPasswordUseCase", {
            useClass: forgot_password_usecase_1.ForgotPasswordUseCase
        });
        tsyringe_1.container.register("IResetPasswordUseCase", {
            useClass: reset_password_usecase_1.ResetPasswordUseCase
        });
        tsyringe_1.container.register("IAddWorkSampleUseCase", {
            useClass: add_work_sample_usecase_1.AddWorkSampleUseCase
        });
        tsyringe_1.container.register("IUpdateWorkSampleUseCase", {
            useClass: update_work_sample_usecase_1.UpdateWorkSampleUseCase
        });
        tsyringe_1.container.register("IAddReviewUseCase", {
            useClass: add_review_usecase_1.AddReviewUseCase
        });
        tsyringe_1.container.register("IGetAllReviewUseCase", {
            useClass: get_all_review_usecase_1.GetAllReviewUseCase
        });
        tsyringe_1.container.register("IGetAllWorkSampleByIdUseCase", {
            useClass: get_all_work_sample_by_id_usecase_1.GetAllWorkSampleByIdUseCase
        });
        tsyringe_1.container.register("IGetAllDashboardDataUseCase", {
            useClass: get_all_dashboard_data_usecase_1.GetAllDashboardDataUseCase
        });
        tsyringe_1.container.register("ICancelTicketUseCase", {
            useClass: cancel_ticket_usecase_1.default
        });
        tsyringe_1.container.register("IChatUseCase", {
            useClass: chat_usecase_1.ChatUseCase
        });
        tsyringe_1.container.register("ICancelBookingUseCase", {
            useClass: cancel_booking_usecase_1.CancelBookingUseCase
        });
        tsyringe_1.container.register("ISaveFCMTokenUseCase", {
            useClass: save_fcm_tocken_usecase_1.SaveFCMTokenUseCase
        });
        tsyringe_1.container.register("IClearFCMTokenUseCase", {
            useClass: clear_fcm_token_usecase_1.ClearFCMTokenUseCase
        });
        tsyringe_1.container.register("IGetVendorBookedDatesUseCase", {
            useClass: get_vendor_booked_dates_usecase_1.GetVendorBookedDatesUseCase
        });
        tsyringe_1.container.register("IGetAllEventsByLocationUseCase", {
            useClass: get_all_events_by_location_1.GetAllEventsByLocationUseCase
        });
        //======================= Register Bycripts =======================//
        tsyringe_1.container.register("IPasswordHasher", {
            useClass: hashPassword_1.HashPassword
        });
        //==================== Register Services =====================//
        tsyringe_1.container.register("IOtpService", {
            useClass: otp_service_1.OtpService
        });
        tsyringe_1.container.register("IEmailService", {
            useClass: email_service_1.EmailService
        });
        tsyringe_1.container.register("IUserExistenceService", {
            useClass: user_existence_service_1.UserExistenceService
        });
        tsyringe_1.container.register("ISendEmailUseCase", {
            useClass: send_email_usecase_1.SendEmailUseCase
        });
        tsyringe_1.container.register("IRefreshTokenUseCase", {
            useClass: refresh_token_usecase_1.RefreshTokenUseCase
        });
        tsyringe_1.container.register("IPaymentService", {
            useClass: payment_service_1.PaymentService
        });
        tsyringe_1.container.register("IQRService", {
            useClass: qr_service_1.QRService
        });
        tsyringe_1.container.register("IPushNotificationService", {
            useClass: firebase_push_notification_1.pushNotificationService
        });
        tsyringe_1.container.register("IGetNotificationByIdUseCase", {
            useClass: get_notification_by_id_usecase_1.GetNotificationByIdUseCase
        });
        tsyringe_1.container.register("IUpdateNotificationReadUseCase", {
            useClass: update_notification_read_usecase_1.UpdateNotificationReadUseCase
        });
        tsyringe_1.container.register("ICheckEventBookingAvliblityUseCase", {
            useClass: check_event_booking_avliblity_usecase_1.CheckEventBookingAvliblityUseCase
        });
        tsyringe_1.container.register("IBlockEventUseCase", {
            useClass: block_event_usecase_1.BlockEventUseCase
        });
        tsyringe_1.container.register("IRescheduleBookingUseCase", {
            useClass: resedul_booking_usecase_1.RescheduleBookingUseCase
        });
    }
}
exports.UseCaseRegistry = UseCaseRegistry;
//# sourceMappingURL=useCase.registry.js.map