import { inject, injectable } from "tsyringe";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { IQRService } from "../../domain/interface/servicesInterface/qr-service.interface";
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface";
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";
import { ICreateTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/create-ticket-usecase.interface";
import { ITicketEntity } from "../../domain/entities/ticket.entity";
import { IRedisTokenRepository } from "../../domain/interface/repositoryInterfaces/redis/redis-token-repository.interface";
import { IPaymentEntity } from "../../domain/entities/payment.entity";









@injectable()
export class CreateTicketUseCase implements ICreateTicketUseCase {
   constructor(
      @inject("IEventRepository") private _eventRepository: IEventRepository,
      @inject("IQRService") private _qrService: IQRService,
      @inject("IPaymentService") private _stripeService: IPaymentService,
      @inject("IPaymentRepository") private _paymentRepository: IPaymentRepository,
      @inject("ITicketRepository") private _ticketRepository: ITicketRepository,
      @inject("IRedisTokenRepository") private _redisTokenRepository: IRedisTokenRepository
   ){}

   async execute(ticket:ITicketEntity, paymentIntentId: string, totalAmount: number, totalCount: number, vendorId: string,clientId:string,eventId:string,email:string,phone:string): Promise<{ stripeClientId: string, createdTicket: ITicketEntity }> {
      const eventDetails = await this._eventRepository.findOne({eventId})
      if(!eventDetails){throw new CustomError("Event not found",HTTP_STATUS.NOT_FOUND)}


        const isLocked = await this._redisTokenRepository.isEventLocked(clientId, eventId);
        if (isLocked) {
          throw new CustomError(
           ERROR_MESSAGES.EVENT_LOCKED, 
            HTTP_STATUS.TOO_MORE_REQUESTS);
         }

        await this._redisTokenRepository.setEventLock(clientId, eventId, 600);

    if(eventDetails.status === "cancelled") throw new CustomError("Event cancelled",HTTP_STATUS.FORBIDDEN) 
    if(eventDetails.status === "completed") throw new CustomError("Event already completed",HTTP_STATUS.FORBIDDEN) 
    if(eventDetails?.ticketPurchased && eventDetails?.ticketPurchased === eventDetails.totalTicket) throw new CustomError("Ticket Sold Out",HTTP_STATUS.FORBIDDEN)
    if(eventDetails?.ticketPurchased && eventDetails?.ticketPurchased + totalCount > eventDetails.totalTicket) throw new CustomError(`Only ${eventDetails.totalTicket - eventDetails.ticketPurchased} tickets are available. Please reduce the quantity.`,HTTP_STATUS.FORBIDDEN)
     
      const HOSTNAME = process.env.HOSTNAME
      const ticketId = generateUniqueId()
      const qrLink = `${HOSTNAME}/verify-ticket/${ticketId}/${eventId}`
      const qrCode = await this._qrService.generateQRCode(qrLink)
      if(!qrCode){throw new CustomError("QR Code generation failed",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
      const clientStripeId = await this._stripeService.createPaymentIntent(totalAmount,"ticket",{ticket:ticket})
      if(!clientStripeId){throw new CustomError("Error while creating stripe client id",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
      const paymentDetails : IPaymentEntity = {
        amount: totalAmount,
        currency: "INR",
        paymentId: paymentIntentId,
        receiverId: vendorId,
        purpose: "ticketBooking",
        status: "pending",
        clientId: clientId,
        ticketId: ticketId,    
      }
      const paymentDocument = await this._paymentRepository.save(paymentDetails)
      if(!paymentDocument){throw new CustomError("Error while saving payment details",HTTP_STATUS.INTERNAL_SERVER_ERROR)}

      let attendeesCount = eventDetails?.ticketPurchased || 0
      attendeesCount += totalCount

       const currentAttendees = eventDetails.attendees || []
        if (!currentAttendees.includes(clientId)) {
          currentAttendees.push(clientId)
        }

       const eventUpdate = {
        attendeesCount,
        attendees:currentAttendees
       }

        await this._eventRepository.update(
        {eventId:eventDetails.eventId},
        eventUpdate
      )

      const ogTicket = {
        email,
        phone,
        eventId,
        ticketId: ticketId,
        qrCodeLink: qrCode,
        clientId: clientId,
        paymentStatus: "pending" as const,
        ticketStatus: "unused" as const,
        ticketCount: totalCount,
        totalAmount: totalAmount,
        paymentTransactionId: paymentDocument.paymentId,
        vendorId: vendorId,
   }
   const createdTicket = await this._ticketRepository.save(ogTicket)
   if(!createdTicket){throw new CustomError("Error while saving ticket details",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
   return {stripeClientId: clientStripeId,createdTicket}
}

}