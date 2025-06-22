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
let GetEventsAttendeesByIdUseCase = class GetEventsAttendeesByIdUseCase {
    _eventRepository;
    _ticketRepository;
    constructor(_eventRepository, _ticketRepository) {
        this._eventRepository = _eventRepository;
        this._ticketRepository = _ticketRepository;
    }
    async execute(eventId) {
        const attendees = await this._eventRepository.findAttendeesById(eventId);
        const tickets = await this._ticketRepository.findAll({ eventId });
        if (!attendees || attendees.length === 0)
            return [];
        const enrichedAttendees = attendees.map((attendee) => {
            const userId = typeof attendee === 'string' ? attendee : attendee.userId;
            const userTicket = tickets.items.find((ticket) => ticket.clientId === userId);
            return {
                ...attendee,
                ticket: userTicket || null
            };
        });
        return enrichedAttendees || [];
    }
};
GetEventsAttendeesByIdUseCase = __decorate([
    injectable(),
    __param(0, inject("IEventRepository")),
    __param(1, inject("ITicketRepository")),
    __metadata("design:paramtypes", [Object, Object])
], GetEventsAttendeesByIdUseCase);
export { GetEventsAttendeesByIdUseCase };
//# sourceMappingURL=get-events-attendees-by-id.usecase.js.map