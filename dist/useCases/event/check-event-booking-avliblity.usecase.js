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
exports.CheckEventBookingAvliblityUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
let CheckEventBookingAvliblityUseCase = class CheckEventBookingAvliblityUseCase {
    constructor(_eventRepository, _ticketRepository) {
        this._eventRepository = _eventRepository;
        this._ticketRepository = _ticketRepository;
    }
    execute(eventId, userId, ticketCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this._eventRepository.findOne({ eventId });
            if (!event)
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.REQUEST_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            const ticket = yield this._ticketRepository.findOne({ eventId, clientId: userId });
            if ((ticket === null || ticket === void 0 ? void 0 : ticket.ticketCount) + ticketCount > event.maxTicketsPerUser) {
                throw new custom_error_1.CustomError(`You have already reached your ticket limit. You can only book ${event.maxTicketsPerUser - (ticket === null || ticket === void 0 ? void 0 : ticket.ticketCount)} more ticket(s).`, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            if (event.totalTicket === event.ticketPurchased) {
                throw new custom_error_1.CustomError("Event is already full", constants_1.HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
};
exports.CheckEventBookingAvliblityUseCase = CheckEventBookingAvliblityUseCase;
exports.CheckEventBookingAvliblityUseCase = CheckEventBookingAvliblityUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IEventRepository")),
    __param(1, (0, tsyringe_1.inject)("ITicketRepository")),
    __metadata("design:paramtypes", [Object, Object])
], CheckEventBookingAvliblityUseCase);
//# sourceMappingURL=check-event-booking-avliblity.usecase.js.map