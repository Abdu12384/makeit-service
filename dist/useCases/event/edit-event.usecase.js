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
exports.EditEventUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
const constants_2 = require("../../shared/constants");
let EditEventUseCase = class EditEventUseCase {
    constructor(_eventRepository, _ticketRepository, _walletRepository, _transactionRepository) {
        this._eventRepository = _eventRepository;
        this._ticketRepository = _ticketRepository;
        this._walletRepository = _walletRepository;
        this._transactionRepository = _transactionRepository;
    }
    execute(eventId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this._eventRepository.findOne({ eventId });
            if (!event) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.REQUEST_NOT_FOUND, constants_2.HTTP_STATUS.NOT_FOUND);
            }
            if ((event === null || event === void 0 ? void 0 : event.status) === "ongoing" && data.status === "upcoming") {
                throw new custom_error_1.CustomError("Event is already ongoing", constants_2.HTTP_STATUS.BAD_REQUEST);
            }
            if ((event === null || event === void 0 ? void 0 : event.status) === "ongoing" && data.status === "cancelled") {
                throw new custom_error_1.CustomError("Cannot cancel an event that is already ongoing.", constants_2.HTTP_STATUS.BAD_REQUEST);
            }
            if ((event === null || event === void 0 ? void 0 : event.status) === "upcoming" && data.status === "completed") {
                throw new custom_error_1.CustomError("Cannot change status from 'upcoming' to 'completed' directly. Please mark it as 'ongoing' first.", constants_2.HTTP_STATUS.BAD_REQUEST);
            }
            if (((event === null || event === void 0 ? void 0 : event.status) === "completed" || (event === null || event === void 0 ? void 0 : event.status) === "cancelled") && (data.status === "upcoming" || data.status === "ongoing" || data.status === "cancelled")) {
                throw new custom_error_1.CustomError("Cannot change status. Event is already completed or cancelled.", constants_2.HTTP_STATUS.BAD_REQUEST);
            }
            if (event.status !== "cancelled" && data.status === "cancelled") {
                const tickets = yield this._ticketRepository.find({
                    eventId,
                    ticketStatus: { $ne: "cancelled" }
                });
                for (const ticket of tickets) {
                    const totalAmount = ticket.totalAmount * ticket.ticketCount;
                    const clientWallet = yield this._walletRepository.findOne({ userId: ticket.clientId });
                    const vendorWallet = yield this._walletRepository.findOne({ userId: ticket.vendorId });
                    if (!(clientWallet === null || clientWallet === void 0 ? void 0 : clientWallet.walletId) || !(vendorWallet === null || vendorWallet === void 0 ? void 0 : vendorWallet.walletId)) {
                        throw new Error("Wallet not found");
                    }
                    yield this._walletRepository.findOne({ userId: ticket.vendorId });
                    yield this._walletRepository.updateWallet(ticket.clientId, totalAmount);
                    yield this._walletRepository.reduceMoney(ticket.vendorId, -totalAmount);
                    const clientTransaction = {
                        amount: totalAmount,
                        currency: "INR",
                        paymentStatus: "credit",
                        paymentType: "ticketBooking",
                        walletId: clientWallet.walletId,
                        relatedTitle: `Event Cancelled Refund from: ${(event === null || event === void 0 ? void 0 : event.title) || "an event"}`
                    };
                    const vendorTransaction = {
                        amount: totalAmount,
                        currency: "INR",
                        paymentStatus: "debit",
                        paymentType: "ticketBooking",
                        walletId: vendorWallet.walletId,
                        relatedTitle: `Event Cancelled Refund from: ${(event === null || event === void 0 ? void 0 : event.title) || "an event"}`
                    };
                    yield this._transactionRepository.save(clientTransaction);
                    yield this._transactionRepository.save(vendorTransaction);
                    yield this._ticketRepository.update({ ticketId: ticket.ticketId }, { ticketStatus: "cancelled" });
                }
            }
            yield this._eventRepository.update({ eventId: event.eventId }, data);
        });
    }
};
exports.EditEventUseCase = EditEventUseCase;
exports.EditEventUseCase = EditEventUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IEventRepository")),
    __param(1, (0, tsyringe_1.inject)("ITicketRepository")),
    __param(2, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(3, (0, tsyringe_1.inject)("ITransactionRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], EditEventUseCase);
//# sourceMappingURL=edit-event.usecase.js.map