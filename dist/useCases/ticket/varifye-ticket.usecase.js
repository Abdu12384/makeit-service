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
let VerifyTicketUseCase = class VerifyTicketUseCase {
    _ticketRepository;
    _eventRepository;
    constructor(_ticketRepository, _eventRepository) {
        this._ticketRepository = _ticketRepository;
        this._eventRepository = _eventRepository;
    }
    async execute(ticketId, eventId) {
        const ticket = await this._ticketRepository.findOne({ ticketId });
        const event = await this._eventRepository.findOne({ eventId });
        console.log('ticket', ticket);
        if (!event)
            throw new CustomError("Event not found", HTTP_STATUS.NOT_FOUND);
        if (!ticket)
            throw new CustomError("Ticket not found", HTTP_STATUS.NOT_FOUND);
        console.log('ticket.eventId', ticket.eventId);
        if (ticket.eventId !== eventId)
            throw new CustomError("Event not found", HTTP_STATUS.NOT_FOUND);
        if (ticket.ticketStatus === "used")
            throw new CustomError("Ticket already used", HTTP_STATUS.FORBIDDEN);
        ticket.ticketStatus = "used";
        ticket.checkedIn = "checked_in";
        event.checkedInCount += ticket.ticketCount;
        const updatedTicket = await this._ticketRepository.update({ ticketId }, ticket);
        const updatedEvent = await this._eventRepository.update({ eventId }, event);
        return updatedTicket;
    }
};
VerifyTicketUseCase = __decorate([
    injectable(),
    __param(0, inject("ITicketRepository")),
    __param(1, inject("IEventRepository")),
    __metadata("design:paramtypes", [Object, Object])
], VerifyTicketUseCase);
export { VerifyTicketUseCase };
//# sourceMappingURL=varifye-ticket.usecase.js.map