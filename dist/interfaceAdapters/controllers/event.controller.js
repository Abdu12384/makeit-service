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
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
let EventController = class EventController {
    _createEventUseCase;
    _getEventsByVendorIdUseCase;
    _editEventUseCase;
    _getAllEventsUseCase;
    _getEventByIdUseCase;
    _getEventsAttendeesByIdUseCase;
    _checkEventBookingAvliblityUseCase;
    _blockEventUseCase;
    constructor(_createEventUseCase, _getEventsByVendorIdUseCase, _editEventUseCase, _getAllEventsUseCase, _getEventByIdUseCase, _getEventsAttendeesByIdUseCase, _checkEventBookingAvliblityUseCase, _blockEventUseCase) {
        this._createEventUseCase = _createEventUseCase;
        this._getEventsByVendorIdUseCase = _getEventsByVendorIdUseCase;
        this._editEventUseCase = _editEventUseCase;
        this._getAllEventsUseCase = _getAllEventsUseCase;
        this._getEventByIdUseCase = _getEventByIdUseCase;
        this._getEventsAttendeesByIdUseCase = _getEventsAttendeesByIdUseCase;
        this._checkEventBookingAvliblityUseCase = _checkEventBookingAvliblityUseCase;
        this._blockEventUseCase = _blockEventUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //  Create Event 
    // ══════════════════════════════════════════════════════════
    async createEvent(req, res) {
        try {
            const data = req.body;
            const { userId, role } = req.user;
            const event = await this._createEventUseCase.execute(data, userId);
            console.log(data);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Event Created"
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Events 
    // ══════════════════════════════════════════════════════════
    async getAllEvents(req, res) {
        try {
            const { page, limit, search } = req.query;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const searchTermString = typeof search === "string" ? search : "";
            const events = await this._getAllEventsUseCase.execute(pageNumber, pageSize, searchTermString);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                events,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Events By Vendor Id 
    // ══════════════════════════════════════════════════════════
    async getAllEventsByVendorId(req, res) {
        try {
            const { userId, role } = req.user;
            const { page, limit } = req.query;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const events = await this._getEventsByVendorIdUseCase.execute(userId, pageNumber, pageSize);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                events
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Edit Event 
    // ══════════════════════════════════════════════════════════
    async editEvent(req, res) {
        try {
            const { eventId } = req.params;
            const data = req.body;
            const event = await this._editEventUseCase.execute(eventId, data);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                event
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Block Event 
    // ══════════════════════════════════════════════════════════
    async blockEvent(req, res) {
        try {
            const { eventId } = req.params;
            const event = await this._blockEventUseCase.blockEvent(eventId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                event
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Check Event Booking Availability 
    // ══════════════════════════════════════════════════════════
    async checkEventBookingAvailability(req, res) {
        try {
            const { eventId } = req.params;
            const { ticketCount } = req.query;
            console.log('ticketCount', ticketCount);
            const { userId } = req.user;
            const event = await this._checkEventBookingAvliblityUseCase.execute(eventId, userId, Number(ticketCount));
            res.status(HTTP_STATUS.OK).json({
                success: true,
                event
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get Event By Id 
    // ══════════════════════════════════════════════════════════
    async getEventById(req, res) {
        try {
            const { eventId } = req.params;
            const event = await this._getEventByIdUseCase.execute(eventId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                event
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Events By Vendor Id 
    // ══════════════════════════════════════════════════════════
    async getAttendeesById(req, res) {
        try {
            const { eventId } = req.params;
            const attendees = await this._getEventsAttendeesByIdUseCase.execute(eventId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                attendees
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
EventController = __decorate([
    injectable(),
    __param(0, inject("ICreateEventUseCase")),
    __param(1, inject("IGetEventsByVendorIdUseCase")),
    __param(2, inject("IEditEventUseCase")),
    __param(3, inject("IGetAllEventsUseCase")),
    __param(4, inject("IGetEventByIdUseCase")),
    __param(5, inject("IGetEventsAttendeesByIdUseCase")),
    __param(6, inject("ICheckEventBookingAvliblityUseCase")),
    __param(7, inject("IBlockEventUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], EventController);
export { EventController };
//# sourceMappingURL=event.controller.js.map