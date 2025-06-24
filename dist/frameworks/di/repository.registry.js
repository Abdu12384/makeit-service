"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryRegistry = void 0;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const client_repository_1 = require("../../interfaceAdapters/repository/users/client.repository");
const otp_repository_1 = require("../../interfaceAdapters/repository/authService-repository/otp.repository");
const vendor_repository_1 = require("../../interfaceAdapters/repository/users/vendor.repository");
const admin_repository_1 = require("../../interfaceAdapters/repository/users/admin.repository");
const refresh_token_repository_1 = require("../../interfaceAdapters/repository/authService-repository/refresh-token.repository");
const redis_token_repository_1 = require("../../interfaceAdapters/repository/redis/redis-token.repository");
const service_repository_1 = require("../../interfaceAdapters/repository/service/service.repository");
const category_repository_1 = require("../../interfaceAdapters/repository/admin/category-repository");
const booking_repository_1 = require("../../interfaceAdapters/repository/booking/booking-repository");
const payment_repository_1 = require("../../interfaceAdapters/repository/payment/payment.repository");
const event_repository_1 = require("../../interfaceAdapters/repository/event/event-repository");
const ticket_repository_1 = require("../../interfaceAdapters/repository/ticket/ticket-repository");
const transaction_repository_1 = require("../../interfaceAdapters/repository/transaction/transaction.repository");
const wallet_repository_1 = require("../../interfaceAdapters/repository/wallet/wallet.repository");
const work_sample_repository_1 = require("../../interfaceAdapters/repository/work-sample/work-sample.repository");
const review_repository_1 = require("../../interfaceAdapters/repository/review/review.repository");
const chat_repository_1 = require("../../interfaceAdapters/repository/chat/chat.repository");
const notification_repository_1 = require("../../interfaceAdapters/repository/notification/notification.repository");
class RepositoryRegistry {
    static registerRepositories() {
        tsyringe_1.container.register('IClientRepository', {
            useClass: client_repository_1.ClientRepository
        });
        tsyringe_1.container.register("IOtpRepositroy", {
            useClass: otp_repository_1.OtpRepositroy
        });
        tsyringe_1.container.register("IVendorRepository", {
            useClass: vendor_repository_1.VendorRepository
        });
        tsyringe_1.container.register("IAdminRepository", {
            useClass: admin_repository_1.AdminRepository
        });
        tsyringe_1.container.register("IRefreshTokenReposiory", {
            useClass: refresh_token_repository_1.RefreshTokenRepository
        });
        tsyringe_1.container.register("IRedisTokenRepository", {
            useClass: redis_token_repository_1.RedisTokenRepository
        });
        tsyringe_1.container.register("IServiceRepository", {
            useClass: service_repository_1.ServiceRepository
        });
        tsyringe_1.container.register("ICategoryRepository", {
            useClass: category_repository_1.CategoryRepository
        });
        tsyringe_1.container.register("IBookingRepository", {
            useClass: booking_repository_1.BookingRepository
        });
        tsyringe_1.container.register("IPaymentRepository", {
            useClass: payment_repository_1.PaymentRepository
        });
        tsyringe_1.container.register("IEventRepository", {
            useClass: event_repository_1.EventRepository
        });
        tsyringe_1.container.register("ITicketRepository", {
            useClass: ticket_repository_1.TicketRepository
        });
        tsyringe_1.container.register("ITransactionRepository", {
            useClass: transaction_repository_1.TransactionRepository
        });
        tsyringe_1.container.register("IWalletRepository", {
            useClass: wallet_repository_1.WalletRepository
        });
        tsyringe_1.container.register("IWorkSampleRepository", {
            useClass: work_sample_repository_1.WorkSampleRepository
        });
        tsyringe_1.container.register("IReviewRepository", {
            useClass: review_repository_1.ReviewRepository
        });
        tsyringe_1.container.register("IChatRepository", {
            useClass: chat_repository_1.ChatRepository
        });
        tsyringe_1.container.register("INotificationRepository", {
            useClass: notification_repository_1.NotificationRepository
        });
    }
}
exports.RepositoryRegistry = RepositoryRegistry;
//# sourceMappingURL=repository.registry.js.map