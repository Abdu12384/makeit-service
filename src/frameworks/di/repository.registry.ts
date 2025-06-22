import 'reflect-metadata';
import { container } from 'tsyringe';

import { IClientRepository} from '../../domain/interface/repositoryInterfaces/users/client.repository.interface.js';
import { ClientRepository } from '../../interfaceAdapters/repository/users/client.repository.js';
import { IOtpRepositroy } from '../../domain/interface/repositoryInterfaces/common-services/otp-service.repository.js';
import { OtpRepositroy } from '../../interfaceAdapters/repository/authService-repository/otp.repository.js';
import { IVendorRepository } from '../../domain/interface/repositoryInterfaces/users/vendor.repository.interface.js';
import { VendorRepository } from '../../interfaceAdapters/repository/users/vendor.repository.js';
import { IAdminRepository } from '../../domain/interface/repositoryInterfaces/users/admin.repository.interface.js';
import { AdminRepository } from '../../interfaceAdapters/repository/users/admin.repository.js';
import { IRefreshTokenReposiory } from '../../domain/interface/repositoryInterfaces/common-services/refresh-token.entity.js';
import { RefreshTokenRepository } from '../../interfaceAdapters/repository/authService-repository/refresh-token.repository.js';
import { IRedisTokenRepository } from '../../domain/interface/repositoryInterfaces/redis/redis-token-repository.interface.js';
import { RedisTokenRepository } from '../../interfaceAdapters/repository/redis/redis-token.repository.js';
import { IServiceRepository } from '../../domain/interface/repositoryInterfaces/service/service-repository.interface.js';
import { ServiceRepository } from '../../interfaceAdapters/repository/service/service.repository.js';
import { ICategoryRepository } from '../../domain/interface/repositoryInterfaces/admin/category-repository.interface.js';
import { CategoryRepository } from '../../interfaceAdapters/repository/admin/category-repository.js';
import { IBookingRepository } from '../../domain/interface/repositoryInterfaces/booking/booking-repository.interface.js';
import { BookingRepository } from '../../interfaceAdapters/repository/booking/booking-repository.js';
import { IPaymentRepository } from '../../domain/interface/repositoryInterfaces/payment/payment-repository.js';
import { PaymentRepository } from '../../interfaceAdapters/repository/payment/payment.repository.js'; 
import { IEventRepository } from '../../domain/interface/repositoryInterfaces/event/event-repository.interface.js';
import { EventRepository } from '../../interfaceAdapters/repository/event/event-repository.js';
import { ITicketRepository } from '../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface.js';
import { TicketRepository } from '../../interfaceAdapters/repository/ticket/ticket-repository.js';
import { ITransactionRepository } from '../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface.js';
import { TransactionRepository } from '../../interfaceAdapters/repository/transaction/transaction.repository.js';
import { IWalletRepository } from '../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface.js';
import { WalletRepository } from '../../interfaceAdapters/repository/wallet/wallet.repository.js';
import { IWorkSampleRepository } from '../../domain/interface/repositoryInterfaces/work-sample/work-sample-repository.interface.js';
import { WorkSampleRepository } from '../../interfaceAdapters/repository/work-sample/work-sample.repository.js';
import { IReviewRepository } from '../../domain/interface/repositoryInterfaces/review/review-repository.interface.js';
import { ReviewRepository } from '../../interfaceAdapters/repository/review/review.repository.js';
import { IChatRepository } from '../../domain/interface/repositoryInterfaces/chat/chat-repository.interface.js';
import { ChatRepository } from '../../interfaceAdapters/repository/chat/chat.repository.js';
import { NotificationRepository } from '../../interfaceAdapters/repository/notification/notification.repository.js';
import { INotificationRepository } from '../../domain/interface/repositoryInterfaces/notification/notification-repository.interface.js';

export class RepositoryRegistry {
   static registerRepositories():void{
    
      container.register<IClientRepository>('IClientRepository',{
        useClass: ClientRepository
      })    

      container.register<IOtpRepositroy>("IOtpRepositroy",{
         useClass: OtpRepositroy
      })

      container.register<IVendorRepository>("IVendorRepository",{
         useClass: VendorRepository
      })

      container.register<IAdminRepository>("IAdminRepository",{
         useClass: AdminRepository
      })

      container.register<IRefreshTokenReposiory>("IRefreshTokenReposiory",{
         useClass: RefreshTokenRepository
      })

      container.register<IRedisTokenRepository>("IRedisTokenRepository",{
         useClass: RedisTokenRepository
      })

      container.register<IServiceRepository>("IServiceRepository",{
         useClass: ServiceRepository
      })

      container.register<ICategoryRepository>("ICategoryRepository",{
         useClass: CategoryRepository
      })

      container.register<IBookingRepository>("IBookingRepository",{
         useClass: BookingRepository
      })

      container.register<IPaymentRepository>("IPaymentRepository",{
         useClass: PaymentRepository
      }) 

      container.register<IEventRepository>("IEventRepository",{
         useClass: EventRepository
      })

      container.register<ITicketRepository>("ITicketRepository",{
         useClass: TicketRepository
      })

      container.register<ITransactionRepository>("ITransactionRepository",{
         useClass: TransactionRepository
      })    

      container.register<IWalletRepository>("IWalletRepository",{
         useClass: WalletRepository
      })

      container.register<IWorkSampleRepository>("IWorkSampleRepository",{
         useClass: WorkSampleRepository
      })

      container.register<IReviewRepository>("IReviewRepository",{
         useClass: ReviewRepository
      })

      container.register<IChatRepository>("IChatRepository",{
         useClass: ChatRepository
      }) 

      container.register<INotificationRepository>("INotificationRepository",{
         useClass: NotificationRepository
      })
    
   }
}