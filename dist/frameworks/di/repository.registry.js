import 'reflect-metadata';
import { container } from 'tsyringe';
import { ClientRepository } from '../../interfaceAdapters/repository/users/client.repository.js';
import { OtpRepositroy } from '../../interfaceAdapters/repository/authService-repository/otp.repository.js';
import { VendorRepository } from '../../interfaceAdapters/repository/users/vendor.repository.js';
import { AdminRepository } from '../../interfaceAdapters/repository/users/admin.repository.js';
import { RefreshTokenRepository } from '../../interfaceAdapters/repository/authService-repository/refresh-token.repository.js';
import { RedisTokenRepository } from '../../interfaceAdapters/repository/redis/redis-token.repository.js';
import { ServiceRepository } from '../../interfaceAdapters/repository/service/service.repository.js';
import { CategoryRepository } from '../../interfaceAdapters/repository/admin/category-repository.js';
import { BookingRepository } from '../../interfaceAdapters/repository/booking/booking-repository.js';
import { PaymentRepository } from '../../interfaceAdapters/repository/payment/payment.repository.js';
import { EventRepository } from '../../interfaceAdapters/repository/event/event-repository.js';
import { TicketRepository } from '../../interfaceAdapters/repository/ticket/ticket-repository.js';
import { TransactionRepository } from '../../interfaceAdapters/repository/transaction/transaction.repository.js';
import { WalletRepository } from '../../interfaceAdapters/repository/wallet/wallet.repository.js';
import { WorkSampleRepository } from '../../interfaceAdapters/repository/work-sample/work-sample.repository.js';
import { ReviewRepository } from '../../interfaceAdapters/repository/review/review.repository.js';
import { ChatRepository } from '../../interfaceAdapters/repository/chat/chat.repository.js';
export class RepositoryRegistry {
    static registerRepositories() {
        container.register('IClientRepository', {
            useClass: ClientRepository
        });
        container.register("IOtpRepositroy", {
            useClass: OtpRepositroy
        });
        container.register("IVendorRepository", {
            useClass: VendorRepository
        });
        container.register("IAdminRepository", {
            useClass: AdminRepository
        });
        container.register("IRefreshTokenReposiory", {
            useClass: RefreshTokenRepository
        });
        container.register("IRedisTokenRepository", {
            useClass: RedisTokenRepository
        });
        container.register("IServiceRepository", {
            useClass: ServiceRepository
        });
        container.register("ICategoryRepository", {
            useClass: CategoryRepository
        });
        container.register("IBookingRepository", {
            useClass: BookingRepository
        });
        container.register("IPaymentRepository", {
            useClass: PaymentRepository
        });
        container.register("IEventRepository", {
            useClass: EventRepository
        });
        container.register("ITicketRepository", {
            useClass: TicketRepository
        });
        container.register("ITransactionRepository", {
            useClass: TransactionRepository
        });
        container.register("IWalletRepository", {
            useClass: WalletRepository
        });
        container.register("IWorkSampleRepository", {
            useClass: WorkSampleRepository
        });
        container.register("IReviewRepository", {
            useClass: ReviewRepository
        });
        container.register("IChatRepository", {
            useClass: ChatRepository
        });
    }
}
//# sourceMappingURL=repository.registry.js.map