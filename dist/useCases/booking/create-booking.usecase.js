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
exports.CreateBookingUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
const constants_2 = require("../../shared/constants");
let CreateBookingUseCase = class CreateBookingUseCase {
    constructor(_bookingRepository, _pushNotificationService) {
        this._bookingRepository = _bookingRepository;
        this._pushNotificationService = _pushNotificationService;
    }
    execute(serviceId, date, email, phone, vendorId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingId = (0, unique_uuid_helper_1.generateUniqueId)();
            yield this._bookingRepository.findExactApprovedBookingByVendorAndDate(vendorId, date);
            const existingBooking = yield this._bookingRepository.findOne({
                clientId: userId,
                serviceId: serviceId,
                status: { $ne: "Cancelled" },
                date: { $in: [date] },
            });
            if (existingBooking) {
                throw new custom_error_1.CustomError("You have already booked this service for this date.", constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            yield this._bookingRepository.save({
                bookingId,
                clientId: userId,
                serviceId,
                email,
                phone,
                vendorId,
                date: [date],
            });
            yield this._pushNotificationService.sendNotification(vendorId, constants_2.NotificationType.SERVICE_BOOKING, `You have received a new booking for ${new Date(date).toDateString()}`, "booking", "vendor");
        });
    }
};
exports.CreateBookingUseCase = CreateBookingUseCase;
exports.CreateBookingUseCase = CreateBookingUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("IPushNotificationService")),
    __metadata("design:paramtypes", [Object, Object])
], CreateBookingUseCase);
//# sourceMappingURL=create-booking.usecase.js.map