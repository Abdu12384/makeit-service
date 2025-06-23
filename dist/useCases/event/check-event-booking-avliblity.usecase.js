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
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
let CheckEventBookingAvliblityUseCase = class CheckEventBookingAvliblityUseCase {
    _eventRepository;
    _ticketRepository;
    constructor(_eventRepository, _ticketRepository) {
        this._eventRepository = _eventRepository;
        this._ticketRepository = _ticketRepository;
    }
    async execute(eventId, userId, ticketCount) {
        const event = await this._eventRepository.findOne({ eventId });
        if (!event)
            throw new CustomError(ERROR_MESSAGES.REQUEST_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        const ticket = await this._ticketRepository.findOne({ eventId, clientId: userId });
        console.log(ticket);
        if (ticket?.ticketCount + ticketCount > event.maxTicketsPerUser) {
            throw new CustomError(`You have already purchased the maximum allowed tickets. You can only book ${event.maxTicketsPerUser - ticket?.ticketCount}`, HTTP_STATUS.BAD_REQUEST);
        }
        if (event.totalTicket === event.ticketPurchased) {
            throw new CustomError("Event is already full", HTTP_STATUS.BAD_REQUEST);
        }
    }
};
CheckEventBookingAvliblityUseCase = __decorate([
    injectable(),
    __param(0, inject("IEventRepository")),
    __param(1, inject("ITicketRepository")),
    __metadata("design:paramtypes", [Object, Object])
], CheckEventBookingAvliblityUseCase);
export { CheckEventBookingAvliblityUseCase };
//# sourceMappingURL=check-event-booking-avliblity.usecase.js.map