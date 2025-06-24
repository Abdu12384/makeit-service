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
exports.TicketController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const constants_1 = require("../../shared/constants");
const constants_2 = require("../../shared/constants");
let TicketController = class TicketController {
    constructor(_createTicketUseCase, _confirmTicketUseCase, _getAllTicketsByIdUseCase, _verifyTicketUseCase, _cancelTicketUseCase) {
        this._createTicketUseCase = _createTicketUseCase;
        this._confirmTicketUseCase = _confirmTicketUseCase;
        this._getAllTicketsByIdUseCase = _getAllTicketsByIdUseCase;
        this._verifyTicketUseCase = _verifyTicketUseCase;
        this._cancelTicketUseCase = _cancelTicketUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //  Create Ticket 
    // ══════════════════════════════════════════════════════════
    createTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ticket, email, phone, eventId, paymentIntentId, totalAmount, totalCount, vendorId } = req.body;
                const { userId: clientId, role } = req.user;
                const { stripeClientId, createdTicket } = yield this._createTicketUseCase.execute(ticket, paymentIntentId, totalAmount, totalCount, vendorId, clientId, eventId, email, phone);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    stripeClientId,
                    createdTicket,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Confirm Payment 
    // ══════════════════════════════════════════════════════════
    confirmTicketAndPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ticket, paymentIntentId, vendorId } = req.body;
                const confirmTicket = yield this._confirmTicketUseCase.execute(ticket, paymentIntentId, vendorId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_2.SUCCESS_MESSAGES.TICKET_CONFIRMED,
                    confirmTicket,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Tickets ById 
    // ══════════════════════════════════════════════════════════
    getAllTicketsByClientId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const { page, limit } = req.query;
                const pageNumber = Number(page);
                const pageSize = Number(limit);
                const tickets = yield this._getAllTicketsByIdUseCase.execute(userId, pageNumber, pageSize);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    tickets,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Verify Ticket 
    // ══════════════════════════════════════════════════════════
    verifyTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ticketId, eventId } = req.params;
                const verifyTicket = yield this._verifyTicketUseCase.execute(ticketId, eventId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_2.SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
                    verifyTicket,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Create Ticket 
    // ══════════════════════════════════════════════════════════
    cancelTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ticketId } = req.params;
            const { cancelCount } = req.body;
            try {
                const cancelTicket = yield this._cancelTicketUseCase.execute(ticketId, cancelCount);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_2.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    cancelTicket,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(res, error);
            }
        });
    }
};
exports.TicketController = TicketController;
exports.TicketController = TicketController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ICreateTicketUseCase")),
    __param(1, (0, tsyringe_1.inject)("IConfirmTicketUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetAllTicketsByIdUseCase")),
    __param(3, (0, tsyringe_1.inject)("IVerifyTicketUseCase")),
    __param(4, (0, tsyringe_1.inject)("ICancelTicketUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], TicketController);
//# sourceMappingURL=ticket.contoller.js.map