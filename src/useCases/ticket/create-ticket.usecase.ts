import { inject, injectable } from "tsyringe";
import { CustomError } from "../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { IQRService } from "../../domain/interface/servicesInterface/qr-service.interface.js";
import { IPaymentService } from "../../domain/interface/servicesInterface/payment.service.interface.js";
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository.js";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface.js";
import { ICreateTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/create-ticket-usecase.interface.js";
import { ITicketEntity } from "../../domain/entities/ticket.entity.js";









@injectable()
export class CreateTicketUseCase implements ICreateTicketUseCase {
   constructor(
      @inject("IEventRepository") private _eventRepository: IEventRepository,
      @inject("IQRService") private _qrService: IQRService,
      @inject("IPaymentService") private _stripeService: IPaymentService,
      @inject("IPaymentRepository") private _paymentRepository: IPaymentRepository,
      @inject("ITicketRepository") private _ticketRepository: ITicketRepository
   ){}

   async execute(ticket:ITicketEntity, paymentIntentId: string, totalAmount: number, totalCount: number, vendorId: string,clientId:string,eventId:string,email:string,phone:string): Promise<{ stripeClientId: string, createdTicket: ITicketEntity }> {
    console.log('clientId her',clientId)
    console.log("vendorId ",vendorId)
      const eventDetails = await this._eventRepository.findOne({eventId})
      console.log("eventDetails",eventDetails)
      if(!eventDetails){throw new CustomError("Event not found",HTTP_STATUS.NOT_FOUND)}
    if(eventDetails.status === "cancelled") throw new CustomError("Event cancelled",HTTP_STATUS.FORBIDDEN) 
    if(eventDetails.status === "completed") throw new CustomError("Event already completed",HTTP_STATUS.FORBIDDEN) 
    if(eventDetails?.ticketPurchased && eventDetails?.ticketPurchased === eventDetails.totalTicket) throw new CustomError("Ticket Sold Out",HTTP_STATUS.FORBIDDEN)
    if (eventDetails?.ticketPurchased && eventDetails?.ticketPurchased + totalCount > eventDetails.totalTicket) throw new CustomError(`Only ${eventDetails.totalTicket - eventDetails.ticketPurchased} tickets are available. Please reduce the quantity.`,HTTP_STATUS.FORBIDDEN)
     
      const HOSTNAME = process.env.HOSTNAME
      const ticketId = generateUniqueId("ticket")
      const qrLink = `${HOSTNAME}/verify-ticket/${ticketId}/${eventId}`
      const qrCode = await this._qrService.generateQRCode(qrLink)
      if(!qrCode){throw new CustomError("QR Code generation failed",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
      const clientStripeId = await this._stripeService.createPaymentIntent(totalAmount,"ticket",{ticket:ticket})
      console.log('clientStripeId',clientStripeId)
      if(!clientStripeId){throw new CustomError("Error while creating stripe client id",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
      console.log('clienId',clientId)
      const paymentDetails = {
        amount: totalAmount,
        currency: "INR",
        paymentId: paymentIntentId,
        receiverId: vendorId,
        purpose: "ticketBooking",
        status: "pending",
        clientId: clientId,
        ticketId: ticketId,    
      }
      const paymentDocument = await this._paymentRepository.save(paymentDetails as any)
      if(!paymentDocument){throw new CustomError("Error while saving payment details",HTTP_STATUS.INTERNAL_SERVER_ERROR)}

      let attendeesCount = eventDetails?.ticketPurchased || 0
      attendeesCount += totalCount
       console.log('attendeesCount',attendeesCount)

       const eventUpdate = {
        attendeesCount,
        attendees:[clientId]
       }

       const updatedEvent = await this._eventRepository.update(
        {eventId:eventDetails.eventId},
        eventUpdate
      )
       console.log('updatedEvent',updatedEvent)

      const ogTicket = {
        email,
        phone,
        eventId,
        ticketId: ticketId,
        qrCodeLink: qrCode,
        clientId: clientId,
        paymentStatus: "pending" as "pending",
        ticketStatus: "unused" as "unused",
        ticketCount: totalCount,
        totalAmount: totalAmount,
        paymentTransactionId: paymentDocument.paymentId,
        vendorId: vendorId,
   }
   console.log('ogTicket',ogTicket)
   const createdTicket = await this._ticketRepository.save(ogTicket)
   if(!createdTicket){throw new CustomError("Error while saving ticket details",HTTP_STATUS.INTERNAL_SERVER_ERROR)}
   return {stripeClientId: clientStripeId,createdTicket}
}

}