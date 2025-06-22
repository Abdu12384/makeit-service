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
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { SUCCESS_MESSAGES } from "../../shared/constants.js";
let TicketController = class TicketController {
    _createTicketUseCase;
    _confirmTicketUseCase;
    _getAllTicketsByIdUseCase;
    _verifyTicketUseCase;
    _cancelTicketUseCase;
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
    async createTicket(req, res) {
        try {
            const { ticket, email, phone, eventId, paymentIntentId, totalAmount, totalCount, vendorId } = req.body;
            const { userId: clientId, role } = req.user;
            const { stripeClientId, createdTicket } = await this._createTicketUseCase.execute(ticket, paymentIntentId, totalAmount, totalCount, vendorId, clientId, eventId, email, phone);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                stripeClientId,
                createdTicket,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Confirm Payment 
    // ══════════════════════════════════════════════════════════
    async confirmTicketAndPayment(req, res) {
        try {
            const { ticket, paymentIntentId, vendorId } = req.body;
            const confirmTicket = await this._confirmTicketUseCase.execute(ticket, paymentIntentId, vendorId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TICKET_CONFIRMED,
                confirmTicket,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Tickets ById 
    // ══════════════════════════════════════════════════════════
    async getAllTicketsByClientId(req, res) {
        try {
            const { userId } = req.user;
            const { page, limit } = req.query;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const tickets = await this._getAllTicketsByIdUseCase.execute(userId, pageNumber, pageSize);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                tickets,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Verify Ticket 
    // ══════════════════════════════════════════════════════════
    async verifyTicket(req, res) {
        try {
            const { ticketId, eventId } = req.params;
            const verifyTicket = await this._verifyTicketUseCase.execute(ticketId, eventId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
                verifyTicket,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Create Ticket 
    // ══════════════════════════════════════════════════════════
    async cancelTicket(req, res) {
        const { ticketId } = req.params;
        const { cancelCount } = req.body;
        try {
            const cancelTicket = await this._cancelTicketUseCase.execute(ticketId, cancelCount);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                cancelTicket,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
TicketController = __decorate([
    injectable(),
    __param(0, inject("ICreateTicketUseCase")),
    __param(1, inject("IConfirmTicketUseCase")),
    __param(2, inject("IGetAllTicketsByIdUseCase")),
    __param(3, inject("IVerifyTicketUseCase")),
    __param(4, inject("ICancelTicketUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], TicketController);
export { TicketController };
//# sourceMappingURL=ticket.contoller.js.map