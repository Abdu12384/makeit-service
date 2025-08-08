import { inject, injectable } from "tsyringe"
import { IBookingPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-payment-usecase.interface"
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface"
import { IServiceRepository } from "../../domain/interface/repositoryInterfaces/service/service-repository.interface"
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface"
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository"
import { IBookingEntity } from "../../domain/entities/booking.entity"
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper"
import { ITransactionsEntity } from "../../domain/entities/transaction.entity"
import { ITransactionRepository } from "../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface"
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface"
import { CustomError } from "../../domain/utils/custom.error"
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants"
import { NotificationType } from "../../shared/constants"
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface"
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface"
import { IRedisTokenRepository } from "../../domain/interface/repositoryInterfaces/redis/redis-token-repository.interface"
import { config } from "../../shared/config"



@injectable()
export class BookingPaymentUseCase implements IBookingPaymentUseCase{
    constructor(
        @inject("IBookingRepository") private _bookingRepository: IBookingRepository,
        @inject("IVendorRepository") private _vendorRepository: IVendorRepository,
        @inject("IServiceRepository") private _serviceRepository: IServiceRepository,
        @inject("IPaymentService") private _paymentService: IPaymentService,
        @inject("IPaymentRepository") private _paymentRepository: IPaymentRepository,
        @inject("ITransactionRepository") private _transactionRepository: ITransactionRepository,
        @inject("IWalletRepository") private _walletRepository: IWalletRepository,
        @inject("IPushNotificationService") private _pushNotificationService: IPushNotificationService,
        @inject("IRedisTokenRepository") private _redisTokenRepository: IRedisTokenRepository
    ){}

    async confirmPayment(paymentIntentId:string,bookingId:string,bookingDetails:IBookingEntity,clientId:string):Promise<{clientStripeId:string,booking:IBookingEntity}>{
        let booking = await this._bookingRepository.findOne({bookingId})
        await this._vendorRepository.findOne({vendorId:booking?.vendorId})

        const serviceId = booking?.serviceId || bookingDetails.serviceId;

                const isLocked = await this._redisTokenRepository.isEventLocked(clientId, serviceId);
                if (isLocked) {
                  throw new CustomError(
                   ERROR_MESSAGES.BOOKING_LOCKED  , 
                    HTTP_STATUS.TOO_MORE_REQUESTS);
                 }
        
                await this._redisTokenRepository.setEventLock(clientId, serviceId, 600);


        const service = await this._serviceRepository.findOne({ serviceId });
 
        if(!service) throw new CustomError(ERROR_MESSAGES.REQUEST_NOT_FOUND,HTTP_STATUS.NOT_FOUND)

        const totalAmount = service.servicePrice;
        const advanceAmount = Math.round(totalAmount * 0.3);
        const balanceAmount = totalAmount - advanceAmount;
      
        let amountToPay: number;
        let vendorShare: number;
      
        if (!booking) {
          // New booking → pay advance
          const newBookingId = generateUniqueId();
          booking = await this._bookingRepository.save({
            bookingId: newBookingId,
            clientId,
            serviceId: bookingDetails.serviceId,
            email: bookingDetails.email,
            phone: bookingDetails.phone,
            vendorId: bookingDetails.vendorId,
            date: bookingDetails.date,
            status: "Pending",
            paymentStatus: "AdvancePaid",
            vendorApproval: "Pending",
            balanceAmount: balanceAmount,
          });
          amountToPay = advanceAmount;
          vendorShare = advanceAmount;
        } else {
          if (booking.paymentStatus === "Successfull") {
            throw new CustomError(ERROR_MESSAGES.BOOKING_ALREADY_PAID,HTTP_STATUS.BAD_REQUEST);
          }
      
          if (booking.paymentStatus === "Pending") {
            // First advance payment for existing booking
            amountToPay = advanceAmount;
            vendorShare = amountToPay
      
            await this._bookingRepository.updateOne(
              { bookingId: booking.bookingId },
              {
                $set: {
                  paymentStatus: "AdvancePaid",
                  balanceAmount: balanceAmount,
                  status: "Confirmed",
                },
              }
            );

            const vendor = await this._vendorRepository.VendorfindOne(booking?.vendorId)
            if (!vendor) {
              throw new Error("Vendor not found"); 
            }
            
            if (!Array.isArray(vendor.bookedDates)) {
              vendor.bookedDates = [{date:new Date(booking!.date[0]),count:0}];
            }

            const index = vendor.bookedDates.findIndex(entry =>
              new Date(entry.date).toDateString() === new Date(booking!.date[0]).toDateString()
            );

            if (index !== -1) {
              vendor.bookedDates[index].count += 1; 
            } else {
              vendor.bookedDates.push({
                date: new Date(booking!.date[0]),
                count: 1
              }); 
            }

            await this._vendorRepository.vendorSave(vendor)

          } else if (booking.paymentStatus === "AdvancePaid") {
            // Balance payment
            if (!booking.balanceAmount || booking.balanceAmount <= 0) {
              throw new CustomError(ERROR_MESSAGES.NO_BALANCE_AMOUNT,HTTP_STATUS.BAD_REQUEST);
            }
            
            const fullBalannceAmount = booking.balanceAmount;
            const platformFee = Math.round(fullBalannceAmount * 0.1);
            const adminId = config.adminId

            const adminWallet = await this._walletRepository.findOne({userId:adminId})
            if(!adminWallet){ throw new CustomError(ERROR_MESSAGES.REQUEST_NOT_FOUND,HTTP_STATUS.NOT_FOUND)}
            
            amountToPay = booking.balanceAmount;
            vendorShare = fullBalannceAmount - platformFee;

            const adminCommission: ITransactionsEntity = {
              amount: platformFee,
              currency: "INR",
              paymentStatus: "credit",
              paymentType: "adminCommission",
              walletId:adminWallet.walletId,
              relatedTitle:`Admin Commission from Service Booking: ${service?.serviceTitle || "a service"}`,
            }

            await this._transactionRepository.save(adminCommission)
            await this._walletRepository.updateWallet(adminWallet.walletId,platformFee)
      
            await this._bookingRepository.updateOne(
              { bookingId: booking.bookingId },
              {
                $set: {
                  paymentStatus: "Successfull",
                  balanceAmount: 0,
                },
              }
            );
          } else {
            throw new Error("Invalid payment status.");
          }
        }
      
        const clientStripeId = await this._paymentService.createPaymentIntent(
          amountToPay,
          "service",
          { bookingId }
        );

      const wallet = await this._walletRepository.findOne({userId:booking.vendorId})
      if(!wallet){throw new CustomError("Wallet not found",HTTP_STATUS.INTERNAL_SERVER_ERROR)}

        const vendorTransactionDetails : ITransactionsEntity = {
          amount: vendorShare,
          currency: "INR",
          paymentStatus: "credit",
          paymentType: "serviceBooking",
          walletId:wallet.walletId,
          relatedTitle:`Service Booking: ${service.serviceTitle || "a service"}`,
        }

       await this._transactionRepository.save(vendorTransactionDetails)
       await this._walletRepository.updateWallet(booking.vendorId,vendorShare)
        
  
        await this._pushNotificationService.sendNotification(
          booking.clientId,
          "Booking Confirmed",
          `Your advance payment for ${service.serviceTitle} is successful.`,
          NotificationType.BOOKIG_ADVANCE_PAYMENT,
          "client"
        );
        
        await this._pushNotificationService.sendNotification(
          booking.vendorId,
          "Advance Payment Received",
          `You have received advance payment for ${service.serviceTitle}.`,
          NotificationType.BOOKIG_ADVANCE_PAYMENT,
          "vendor"
        );

        return { booking, clientStripeId };
    }
}

