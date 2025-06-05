var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../domain/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
let CreateTicketUseCase = class CreateTicketUseCase {
    _eventRepository;
    _qrService;
    _stripeService;
    _paymentRepository;
    _ticketRepository;
    constructor(_eventRepository, _qrService, _stripeService, _paymentRepository, _ticketRepository) {
        this._eventRepository = _eventRepository;
        this._qrService = _qrService;
        this._stripeService = _stripeService;
        this._paymentRepository = _paymentRepository;
        this._ticketRepository = _ticketRepository;
    }
    async execute(ticket, paymentIntentId, totalAmount, totalCount, vendorId, clientId) {
        console.log('clientId her', clientId);
        console.log("vendorId ", vendorId);
        const eventDetails = await this._eventRepository.findOne({ eventId: ticket.eventId });
        if (!eventDetails) {
            throw new CustomError("Event not found", HTTP_STATUS.NOT_FOUND);
        }
        if (eventDetails.status === "cancelled")
            throw new CustomError("Event cancelled", HTTP_STATUS.FORBIDDEN);
        if (eventDetails.status === "completed")
            throw new CustomError("Event already completed", HTTP_STATUS.FORBIDDEN);
        if (eventDetails?.ticketPurchased && eventDetails?.ticketPurchased > eventDetails.totalTicket)
            throw new CustomError("Ticket Sold Out", HTTP_STATUS.FORBIDDEN);
        if (eventDetails?.ticketPurchased && eventDetails?.ticketPurchased + totalCount > eventDetails.totalTicket)
            throw new CustomError(`Only ${eventDetails.totalTicket - eventDetails.ticketPurchased} tickets are available. Please reduce the quantity.`, HTTP_STATUS.FORBIDDEN);
        const HOSTNAME = process.env.HOSTNAME;
        const ticketId = generateUniqueId("ticket");
        const qrLink = `${HOSTNAME}/verify-ticket/${ticketId}/${ticket.eventId}`;
        const qrCode = await this._qrService.generateQRCode(qrLink);
        if (!qrCode) {
            throw new CustomError("QR Code generation failed", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        const clientStripeId = await this._stripeService.createPaymentIntent(totalAmount, "ticket", { ticket: ticket });
        console.log('clientStripeId', clientStripeId);
        if (!clientStripeId) {
            throw new CustomError("Error while creating stripe client id", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        console.log('clienId', clientId);
        const paymentDetails = {
            amount: totalAmount,
            currency: "INR",
            paymentId: paymentIntentId,
            receiverId: vendorId,
            purpose: "ticketBooking",
            status: "pending",
            clientId: clientId,
            ticketId: ticketId,
        };
        const paymentDocument = await this._paymentRepository.save(paymentDetails);
        if (!paymentDocument) {
            throw new CustomError("Error while saving payment details", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        let attendeesCount = eventDetails?.ticketPurchased || 0;
        attendeesCount += totalCount;
        console.log('attendeesCount', attendeesCount);
        const eventUpdate = {
            attendeesCount,
            attendees: [clientId]
        };
        const updatedEvent = await this._eventRepository.update({ eventId: eventDetails.eventId }, eventUpdate);
        console.log('updatedEvent', updatedEvent);
        const ogTicket = {
            ...ticket,
            ticketId: ticketId,
            qrCodeLink: qrCode,
            clientId: clientId,
            paymentStatus: "pending",
            ticketStatus: "unused",
            ticketCount: totalCount,
            totalAmount: totalAmount,
            paymentTransactionId: paymentDocument.paymentId,
            vendorId: vendorId,
        };
        console.log('ogTicket', ogTicket);
        const createdTicket = await this._ticketRepository.save(ogTicket);
        if (!createdTicket) {
            throw new CustomError("Error while saving ticket details", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        return { stripeClientId: clientStripeId, createdTicket };
    }
};
CreateTicketUseCase = __decorate([
    injectable(),
    __param(0, inject("IEventRepository")),
    __param(1, inject("IQRService")),
    __param(2, inject("IPaymentService")),
    __param(3, inject("IPaymentRepository")),
    __param(4, inject("ITicketRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreateTicketUseCase);
export { CreateTicketUseCase };
//# sourceMappingURL=create-ticket.usecase.js.map