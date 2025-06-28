"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyTicketUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
let VerifyTicketUseCase = class VerifyTicketUseCase {
    constructor(_ticketRepository, _eventRepository) {
        this._ticketRepository = _ticketRepository;
        this._eventRepository = _eventRepository;
    }
    execute(ticketId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const ticket = yield this._ticketRepository.findOne({ ticketId });
            const event = yield this._eventRepository.findOne({ eventId });
            if (!event)
                throw new custom_error_1.CustomError("Event not found", constants_1.HTTP_STATUS.NOT_FOUND);
            if (!ticket)
                throw new custom_error_1.CustomError("Ticket not found", constants_1.HTTP_STATUS.NOT_FOUND);
            if (ticket.eventId !== eventId)
                throw new custom_error_1.CustomError("Event not found", constants_1.HTTP_STATUS.NOT_FOUND);
            if (ticket.checkedIn === "cancelled")
                throw new custom_error_1.CustomError("Ticket already cancelled", constants_1.HTTP_STATUS.FORBIDDEN);
            if (ticket.ticketStatus === "used")
                throw new custom_error_1.CustomError("Ticket already used", constants_1.HTTP_STATUS.FORBIDDEN);
            ticket.ticketStatus = "used";
            ticket.checkedIn = "checked_in";
            event.checkedInCount = (_a = event.checkedInCount) !== null && _a !== void 0 ? _a : 0; // initialize if undefined
            event.checkedInCount += ticket.ticketCount;
            const updatedTicket = yield this._ticketRepository.update({ ticketId }, ticket);
            const updatedEvent = yield this._eventRepository.update({ eventId }, event);
            return updatedTicket;
        });
    }
};
exports.VerifyTicketUseCase = VerifyTicketUseCase;
exports.VerifyTicketUseCase = VerifyTicketUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ITicketRepository")),
    __param(1, (0, tsyringe_1.inject)("IEventRepository")),
    __metadata("design:paramtypes", [Object, Object])
], VerifyTicketUseCase);
//# sourceMappingURL=varifye-ticket.usecase.js.map