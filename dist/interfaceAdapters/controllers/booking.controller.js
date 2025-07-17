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
exports.BookingController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const error_handler_1 = require("../../shared/utils/error.handler");
let BookingController = class BookingController {
    constructor(_createBookingUseCase, _getAllBookingUseCase, _updateBookingStatusUseCase, _cancelBookingUseCase, _rescheduleBookingUseCase, _getVendorBookedDatesUseCase) {
        this._createBookingUseCase = _createBookingUseCase;
        this._getAllBookingUseCase = _getAllBookingUseCase;
        this._updateBookingStatusUseCase = _updateBookingStatusUseCase;
        this._cancelBookingUseCase = _cancelBookingUseCase;
        this._rescheduleBookingUseCase = _rescheduleBookingUseCase;
        this._getVendorBookedDatesUseCase = _getVendorBookedDatesUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //  Book Service
    // ══════════════════════════════════════════════════════════
    bookService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceId } = req.params;
                const { date, email, phone, vendorId } = req.body;
                const { userId, role } = req.user;
                const booking = yield this._createBookingUseCase.execute(serviceId, date, email, phone, vendorId, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    booking,
                    message: constants_1.SUCCESS_MESSAGES.BOOKING_SUCCESS
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Bookings
    // ══════════════════════════════════════════════════════════
    getAllBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, status } = req.query;
                const { role, userId } = req.user;
                const pageNumber = Number(page);
                const pageSize = Number(limit);
                const bookings = yield this._getAllBookingUseCase.execute(pageNumber, pageSize, status, role, userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    bookings,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Bookings
    // ══════════════════════════════════════════════════════════
    updateBookingStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const { status, reason } = req.body;
                const booking = yield this._updateBookingStatusUseCase.execute(bookingId, status, reason);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    booking,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Cancel Booking
    // ══════════════════════════════════════════════════════════
    cancelBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const booking = yield this._cancelBookingUseCase.execute(bookingId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    booking,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Reschedule Booking
    // ══════════════════════════════════════════════════════════
    rescheduleBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const { selectedDate, rescheduleReason } = req.body;
                const booking = yield this._rescheduleBookingUseCase.execute(bookingId, selectedDate, rescheduleReason);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    booking,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Approve or Reject Reschedule Booking
    // ══════════════════════════════════════════════════════════
    approveOrRejectRescheduleBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const { status } = req.body;
                const booking = yield this._rescheduleBookingUseCase.approveOrRejectRescheduleBooking(bookingId, status);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    booking,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    // ══════════════════════════════════════════════════════════
    //  Vendor Booked Dates
    // ══════════════════════════════════════════════════════════
    getBookedDates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role, userId } = req.user;
                const booking = yield this._getVendorBookedDatesUseCase.execute(userId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                    booking,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.BookingController = BookingController;
exports.BookingController = BookingController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ICreateBookingUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetAllBookingUseCase")),
    __param(2, (0, tsyringe_1.inject)("IUpdateBookingStatusUseCase")),
    __param(3, (0, tsyringe_1.inject)("ICancelBookingUseCase")),
    __param(4, (0, tsyringe_1.inject)("IRescheduleBookingUseCase")),
    __param(5, (0, tsyringe_1.inject)("IGetVendorBookedDatesUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], BookingController);
//# sourceMappingURL=booking.controller.js.map