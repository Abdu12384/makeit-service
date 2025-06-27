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
exports.RescheduleBookingUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const notification_1 = require("../../shared/dtos/notification");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
let RescheduleBookingUseCase = class RescheduleBookingUseCase {
    constructor(_bookingRepository, _pushNotificationService, _vendorRepository) {
        this._bookingRepository = _bookingRepository;
        this._pushNotificationService = _pushNotificationService;
        this._vendorRepository = _vendorRepository;
    }
    execute(bookingId, selectedDate, rescheduleReason) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this._bookingRepository.findOne({ bookingId });
            if (!booking) {
                throw new Error("Booking not found.");
            }
            const existingDate = new Date(booking.date[0]).toDateString();
            const newRequestedDate = new Date(selectedDate).toDateString();
            if (existingDate === newRequestedDate) {
                throw new custom_error_1.CustomError("Selected date is the same as the current booking date.", constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            yield this._bookingRepository.updateOne({ bookingId }, {
                $set: {
                    rescheduleDate: selectedDate,
                    rescheduleReason,
                    rescheduleStatus: "Requested"
                },
            });
            this._pushNotificationService.sendNotification(booking.clientId, "booking", `Your booking has a new reschedule request from the vendor for ${selectedDate}.`, notification_1.NotificationType.RESCHEDULE_SERVICE_BOOKING, "client");
        });
    }
    approveOrRejectRescheduleBooking(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this._bookingRepository.findOne({ bookingId });
            if (!booking) {
                throw new Error("Booking not found.");
            }
            if (status === "Approved") {
                const oldDate = new Date(booking.date[0]);
                const newDate = new Date(booking.rescheduleDate);
                const vendor = yield this._vendorRepository.VendorfindOne(booking.vendorId);
                if (!vendor) {
                    throw new Error("Vendor not found.");
                }
                if (!Array.isArray(vendor.bookedDates)) {
                    vendor.bookedDates = [];
                }
                const oldIndex = vendor.bookedDates.findIndex((entry) => new Date(entry.date).toDateString() === oldDate.toDateString());
                if (oldIndex !== -1) {
                    vendor.bookedDates[oldIndex].count -= 1;
                    if (vendor.bookedDates[oldIndex].count <= 0) {
                        vendor.bookedDates.splice(oldIndex, 1);
                    }
                }
                const newIndex = vendor.bookedDates.findIndex((entry) => new Date(entry.date).toDateString() === newDate.toDateString());
                if (newIndex !== -1) {
                    vendor.bookedDates[newIndex].count += 1;
                }
                else {
                    vendor.bookedDates.push({ date: newDate, count: 1 });
                }
                yield this._vendorRepository.vendorSave(vendor);
                yield this._bookingRepository.updateOne({ bookingId }, {
                    $set: {
                        status: "Rescheduled",
                        date: [booking.rescheduleDate],
                        rescheduleStatus: "Approved"
                    },
                });
                this._pushNotificationService.sendNotification(booking.clientId, "booking", `Your booking has been successfully rescheduled to ${new Date(booking === null || booking === void 0 ? void 0 : booking.rescheduleDate).toDateString()}.`, notification_1.NotificationType.RESCHEDULE_SERVICE_BOOKING, "client");
                this._pushNotificationService.sendNotification(booking.vendorId, "booking", `The client has accepted your reschedule request. New date: ${new Date(booking === null || booking === void 0 ? void 0 : booking.rescheduleDate).toDateString()}.`, notification_1.NotificationType.RESCHEDULE_SERVICE_BOOKING, "vendor");
            }
            if (status === "Rejected") {
                yield this._bookingRepository.updateOne({ bookingId }, {
                    $set: {
                        status: "Pending",
                        rescheduleStatus: "Rejected"
                    },
                });
                this._pushNotificationService.sendNotification(booking.clientId, "booking", `You have rejected the vendor's request to reschedule the booking.`, notification_1.NotificationType.RESCHEDULE_SERVICE_BOOKING, "client");
                this._pushNotificationService.sendNotification(booking.vendorId, "booking", `Client has rejected your request to reschedule the booking.`, notification_1.NotificationType.RESCHEDULE_SERVICE_BOOKING, "vendor");
            }
        });
    }
};
exports.RescheduleBookingUseCase = RescheduleBookingUseCase;
exports.RescheduleBookingUseCase = RescheduleBookingUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("IPushNotificationService")),
    __param(2, (0, tsyringe_1.inject)("IVendorRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], RescheduleBookingUseCase);
//# sourceMappingURL=resedul-booking.usecase.js.map