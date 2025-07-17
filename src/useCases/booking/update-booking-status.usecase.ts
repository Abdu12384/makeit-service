import { inject, injectable } from "tsyringe"
import { IUpdateBookingStatusUseCase } from "../../domain/interface/useCaseInterface/booking/update-booking-status-usecase.interface"
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface"
import { IEmailService } from "../../domain/interface/servicesInterface/email.service.interface"
import { CustomError } from "../../domain/utils/custom.error"
import { HTTP_STATUS } from "../../shared/constants"
import { IPushNotificationService } from "../../domain/interface/servicesInterface/push-notification-service-interface"
import { NotificationType } from "../../shared/dtos/notification"
import { ITransactionsEntity } from "../../domain/entities/transaction.entity"
import { IServiceRepository } from "../../domain/interface/repositoryInterfaces/service/service-repository.interface"
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface"
import { ITransactionRepository } from "../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface"
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface"




@injectable()
export class UpdateBookingStatusUseCase implements IUpdateBookingStatusUseCase{
    constructor(  
        @inject("IBookingRepository") 
        private _bookingRepository: IBookingRepository,
        @inject("IEmailService")
        private _mailService: IEmailService,
        @inject("IPushNotificationService")
        private _pushNotificationService: IPushNotificationService,
        @inject("IServiceRepository")
        private _serviceRepository: IServiceRepository,
        @inject("IWalletRepository")
        private _walletRepository: IWalletRepository,
        @inject("ITransactionRepository")
        private _transactionRepository: ITransactionRepository,
        @inject("IVendorRepository")
        private _vendorRepository: IVendorRepository
    ){}

    async execute(bookingId:string,status:string,reason?:string):Promise<void>{
        const booking = await this._bookingRepository.findOne({bookingId})
        if(!booking){
          throw new Error("Booking not found")
        }

        if(status === "Cancelled" && booking.paymentStatus === "AdvancePaid"){

          const service = await this._serviceRepository.findOne({ serviceId: booking.serviceId });
          if (!service) throw new Error("Service not found");

          
          const totalAmount = service.servicePrice;
          const advanceAmount = Math.round(totalAmount * 0.3);
          let refundAmount = 0;


          if (booking.paymentStatus === "AdvancePaid") {
            refundAmount = advanceAmount;
          } else if (booking.paymentStatus === "Successfull") {
            refundAmount = totalAmount;
          }

          booking.status = "Cancelled"
          booking.paymentStatus = "Refunded"
          booking.cancellationReason = reason



          const vendor = await this._vendorRepository.VendorfindOne(booking.vendorId);
          if (!vendor) throw new Error("Vendor not found");

          if (!Array.isArray(vendor.bookedDates)) {
            vendor.bookedDates = [];
          }

          const oldIndex = vendor.bookedDates.findIndex(
            (entry) => new Date(entry.date).toDateString() === new Date(booking.date[0]).toDateString()
          );
          
          if (oldIndex !== -1) {
            vendor.bookedDates[oldIndex].count -= 1;
            if (vendor.bookedDates[oldIndex].count <= 0) {
              vendor.bookedDates.splice(oldIndex, 1);
            }
          }

          await this._vendorRepository.vendorSave(vendor)


          
          if (refundAmount > 0) {
           const clientWallet = await this._walletRepository.updateWallet(booking.clientId,refundAmount)
        
           const vendorWallet = await this._walletRepository.reduceMoney(booking.vendorId,refundAmount)
        
            const clientTransaction: ITransactionsEntity = {
              amount: refundAmount,
              currency: "INR",
              paymentStatus: "credit",
              paymentType: "refund",
              walletId: clientWallet?.walletId as string,
              relatedTitle: `Refund from: ${service?.serviceTitle || "a transaction"}`
            };
        
            const vendorTransaction: ITransactionsEntity = {
              amount: refundAmount,
              currency: "INR",
              paymentStatus: "debit",
              paymentType: "refund",
              walletId: vendorWallet?.walletId as string,
              relatedTitle: `Refund from: ${service?.serviceTitle || "a transaction"}`
            };
            
          await this._transactionRepository.save(clientTransaction)
          await this._transactionRepository.save(vendorTransaction)
        
          }

          this._mailService.sendCustomEmail(
            booking.email,
            "Booking Cancelled",
            `Your booking has been cancelled. Reason: ${reason || "No reason provided."}`
          )

          const clientMessage =
              refundAmount > 0
                ? `Your booking has been cancelled and ₹${refundAmount} has been refunded to your wallet.`
                : `Your booking has been cancelled successfully.`;


          await this._pushNotificationService.sendNotification(
            booking.clientId,
            "booking",
            clientMessage,
            NotificationType.BOOKING_CANCELLED,
            "client"
          );


          await this._pushNotificationService.sendNotification(
            booking.vendorId,
            "booking",
            clientMessage,
            NotificationType.BOOKING_CANCELLED,
            "vendor"
          );

        }else if(status === "Cancelled"){
          booking.status = "Cancelled"
          booking.cancellationReason = reason
          this._mailService.sendCustomEmail(
            booking.email,
            "Booking Cancelled",
            `Your booking has been cancelled. Reason: ${reason || "No reason provided."}`
          )
        }


        
        if (status === "Approved" ) {

          // const conflict = await this._bookingRepository.checkVendorBookingConflict(
          //   booking.vendorId,
          //   booking.date[0] as Date,
          //   booking.bookingId as string,
          // );
        
          // if (conflict) throw new CustomError("You already have an approved booking on this date.",HTTP_STATUS.BAD_REQUEST);

          booking.vendorApproval = "Approved";
          booking.status = "Pending";

          await this._pushNotificationService.sendNotification(
            booking.clientId,
            `Your booking has been approved. Please make the advance payment of ₹${booking.balanceAmount} to complete the booking.`,
            "booking",
            NotificationType.BOOKING_APPROVED,
            "client"
          );

        } else if (status === "Rejected") {
          booking.vendorApproval = "Rejected";
          booking.status = "Rejected";
          booking.rejectionReason = reason;
        
          await this._mailService.sendCustomEmail(
            booking.email,
            "Booking Rejected",
            `Your booking has been rejected. Reason: ${reason || "No reason provided."}`
          );

          await this._pushNotificationService.sendNotification(
            booking.clientId,
            "booking",
            `Your booking has been rejected. Reason: ${reason || "No reason provided."}`,
            NotificationType.BOOKING_REJECTED,
            "client"
          );
        } else if (status === "Completed") {
          const today = new Date();
          const bookingDate = new Date(booking.date[0]);  
        
          if (bookingDate > today) {
            throw new CustomError("You can only mark this booking as completed after the booking date.", HTTP_STATUS.BAD_REQUEST);
          }
        
          booking.isComplete = true;
          booking.status = "Completed";

          await this._pushNotificationService.sendNotification(
            booking.clientId,
            "booking",
            `Your booking has been completed.`,
            NotificationType.BOOKING_COMPLETED,
            "client"
          );
        }

        await this._bookingRepository.update(
          {bookingId},
          booking
        )
    }
}