import 'reflect-metadata';
import { container } from 'tsyringe';

import { IClientRepository} from '../../domain/interface/repositoryInterfaces/users/client.repository.interface';
import { ClientRepository } from '../../interfaceAdapters/repository/users/client.repository';
import { IOtpRepositroy } from '../../domain/interface/repositoryInterfaces/common-services/otp-service.repository';
import { OtpRepositroy } from '../../interfaceAdapters/repository/authService-repository/otp.repository';
import { IVendorRepository } from '../../domain/interface/repositoryInterfaces/users/vendor.repository.interface';
import { VendorRepository } from '../../interfaceAdapters/repository/users/vendor.repository';
import { IAdminRepository } from '../../domain/interface/repositoryInterfaces/users/admin.repository.interface';
import { AdminRepository } from '../../interfaceAdapters/repository/users/admin.repository';
import { IRefreshTokenReposiory } from '../../domain/interface/repositoryInterfaces/common-services/refresh-token.entity';
import { RefreshTokenRepository } from '../../interfaceAdapters/repository/authService-repository/refresh-token.repository';
import { IRedisTokenRepository } from '../../domain/interface/repositoryInterfaces/redis/redis-token-repository.interface';
import { RedisTokenRepository } from '../../interfaceAdapters/repository/redis/redis-token.repository';
import { IServiceRepository } from '../../domain/interface/repositoryInterfaces/service/service-repository.interface';
import { ServiceRepository } from '../../interfaceAdapters/repository/service/service.repository';
import { ICategoryRepository } from '../../domain/interface/repositoryInterfaces/admin/category-repository.interface';
import { CategoryRepository } from '../../interfaceAdapters/repository/admin/category-repository';
import { IBookingRepository } from '../../domain/interface/repositoryInterfaces/booking/booking-repository.interface';
import { BookingRepository } from '../../interfaceAdapters/repository/booking/booking-repository';
import { IPaymentRepository } from '../../domain/interface/repositoryInterfaces/payment/payment-repository';
import { PaymentRepository } from '../../interfaceAdapters/repository/payment/payment.repository'; 
import { IEventRepository } from '../../domain/interface/repositoryInterfaces/event/event-repository.interface';
import { EventRepository } from '../../interfaceAdapters/repository/event/event-repository';
import { ITicketRepository } from '../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface';
import { TicketRepository } from '../../interfaceAdapters/repository/ticket/ticket-repository';
import { ITransactionRepository } from '../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface';
import { TransactionRepository } from '../../interfaceAdapters/repository/transaction/transaction.repository';
import { IWalletRepository } from '../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface';
import { WalletRepository } from '../../interfaceAdapters/repository/wallet/wallet.repository';
import { IWorkSampleRepository } from '../../domain/interface/repositoryInterfaces/work-sample/work-sample-repository.interface';
import { WorkSampleRepository } from '../../interfaceAdapters/repository/work-sample/work-sample.repository';
import { IReviewRepository } from '../../domain/interface/repositoryInterfaces/review/review-repository.interface';
import { ReviewRepository } from '../../interfaceAdapters/repository/review/review.repository';
import { IChatRepository } from '../../domain/interface/repositoryInterfaces/chat/chat-repository.interface';
import { ChatRepository } from '../../interfaceAdapters/repository/chat/chat.repository';
import { NotificationRepository } from '../../interfaceAdapters/repository/notification/notification.repository';
import { INotificationRepository } from '../../domain/interface/repositoryInterfaces/notification/notification-repository.interface';

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