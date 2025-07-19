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
exports.EventController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const error_handler_1 = require("../../shared/utils/error.handler");
let EventController = class EventController {
    constructor(_createEventUseCase, _getEventsByVendorIdUseCase, _editEventUseCase, _getAllEventsUseCase, _getEventByIdUseCase, _getEventsAttendeesByIdUseCase, _checkEventBookingAvliblityUseCase, _blockEventUseCase, _getAllEventsByLocationUseCase) {
        this._createEventUseCase = _createEventUseCase;
        this._getEventsByVendorIdUseCase = _getEventsByVendorIdUseCase;
        this._editEventUseCase = _editEventUseCase;
        this._getAllEventsUseCase = _getAllEventsUseCase;
        this._getEventByIdUseCase = _getEventByIdUseCase;
        this._getEventsAttendeesByIdUseCase = _getEventsAttendeesByIdUseCase;
        this._checkEventBookingAvliblityUseCase = _checkEventBookingAvliblityUseCase;
        this._blockEventUseCase = _blockEventUseCase;
        this._getAllEventsByLocationUseCase = _getAllEventsByLocationUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //  Create Event 
    // ══════════════════════════════════════════════════════════
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { userId, role } = req.user;
                const event = yield this._createEventUseCase.execute(data, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: "Event Created"
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Events 
    // ══════════════════════════════════════════════════════════
    getAllEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, search } = req.query;
                const pageNumber = Number(page);
                const pageSize = Number(limit);
                const searchTermString = typeof search === "string" ? search : "";
                const events = yield this._getAllEventsUseCase.execute(pageNumber, pageSize, searchTermString);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    events,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Events By Vendor Id 
    // ══════════════════════════════════════════════════════════
    getAllEventsByVendorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = req.user;
                const { page, limit } = req.query;
                const pageNumber = Number(page);
                const pageSize = Number(limit);
                const events = yield this._getEventsByVendorIdUseCase.execute(userId, pageNumber, pageSize);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    events
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Edit Event 
    // ══════════════════════════════════════════════════════════
    editEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                const data = req.body;
                const event = yield this._editEventUseCase.execute(eventId, data);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    event
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Block Event 
    // ══════════════════════════════════════════════════════════
    blockEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                const event = yield this._blockEventUseCase.blockEvent(eventId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    event
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Check Event Booking Availability 
    // ══════════════════════════════════════════════════════════
    checkEventBookingAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                const { ticketCount } = req.query;
                const { userId } = req.user;
                const event = yield this._checkEventBookingAvliblityUseCase.execute(eventId, userId, Number(ticketCount));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    event
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Get Event By Id 
    // ══════════════════════════════════════════════════════════
    getEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                const event = yield this._getEventByIdUseCase.execute(eventId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    event
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Events By Vendor Id 
    // ══════════════════════════════════════════════════════════
    getAttendeesById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                const { page, limit } = req.query;
                const pageNumber = Number(page);
                const pageSize = Number(limit);
                const attendees = yield this._getEventsAttendeesByIdUseCase.execute(eventId, pageNumber, pageSize);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    attendees
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Block Event 
    // ══════════════════════════════════════════════════════════
    getAllEventsByLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lat, lng, radius } = req.query;
                const events = yield this._getAllEventsByLocationUseCase.execute(Number(lat), Number(lng), Number(radius));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    events,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.EventController = EventController;
exports.EventController = EventController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ICreateEventUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetEventsByVendorIdUseCase")),
    __param(2, (0, tsyringe_1.inject)("IEditEventUseCase")),
    __param(3, (0, tsyringe_1.inject)("IGetAllEventsUseCase")),
    __param(4, (0, tsyringe_1.inject)("IGetEventByIdUseCase")),
    __param(5, (0, tsyringe_1.inject)("IGetEventsAttendeesByIdUseCase")),
    __param(6, (0, tsyringe_1.inject)("ICheckEventBookingAvliblityUseCase")),
    __param(7, (0, tsyringe_1.inject)("IBlockEventUseCase")),
    __param(8, (0, tsyringe_1.inject)("IGetAllEventsByLocationUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], EventController);
//# sourceMappingURL=event.controller.js.map