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
let BookingController = class BookingController {
    _createBookingUseCase;
    _getAllBookingUseCase;
    _updateBookingStatusUseCase;
    _cancelBookingUseCase;
    constructor(_createBookingUseCase, _getAllBookingUseCase, _updateBookingStatusUseCase, _cancelBookingUseCase) {
        this._createBookingUseCase = _createBookingUseCase;
        this._getAllBookingUseCase = _getAllBookingUseCase;
        this._updateBookingStatusUseCase = _updateBookingStatusUseCase;
        this._cancelBookingUseCase = _cancelBookingUseCase;
    }
    // ══════════════════════════════════════════════════════════
    //  Book Service
    // ══════════════════════════════════════════════════════════
    async bookService(req, res) {
        try {
            const { serviceId } = req.params;
            const { date, email, phone, vendorId } = req.body;
            const { userId, role } = req.user;
            const booking = await this._createBookingUseCase.execute(serviceId, date, email, phone, vendorId, userId);
            console.log('created booking', booking);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                booking,
                message: SUCCESS_MESSAGES.BOOKING_SUCCESS
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Bookings
    // ══════════════════════════════════════════════════════════
    async getAllBookings(req, res) {
        try {
            const { page, limit } = req.query;
            const { role, userId } = req.user;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const bookings = await this._getAllBookingUseCase.execute(pageNumber, pageSize, role, userId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                bookings,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Get All Bookings
    // ══════════════════════════════════════════════════════════
    async updateBookingStatus(req, res) {
        try {
            const { bookingId } = req.params;
            const { status, reason } = req.body;
            console.log('bookingId', bookingId);
            console.log('status', status);
            console.log('reason', reason);
            const booking = await this._updateBookingStatusUseCase.execute(bookingId, status, reason);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                booking,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
    // ══════════════════════════════════════════════════════════
    //  Cancel Booking
    // ══════════════════════════════════════════════════════════
    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const booking = await this._cancelBookingUseCase.execute(bookingId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                booking,
            });
        }
        catch (error) {
            handleErrorResponse(res, error);
        }
    }
};
BookingController = __decorate([
    injectable(),
    __param(0, inject("ICreateBookingUseCase")),
    __param(1, inject("IGetAllBookingUseCase")),
    __param(2, inject("IUpdateBookingStatusUseCase")),
    __param(3, inject("ICancelBookingUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], BookingController);
export { BookingController };
//# sourceMappingURL=booking.controller.js.map