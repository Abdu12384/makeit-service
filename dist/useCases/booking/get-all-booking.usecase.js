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
exports.GetAllBookingUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let GetAllBookingUseCase = class GetAllBookingUseCase {
    constructor(_bookingRepository) {
        this._bookingRepository = _bookingRepository;
    }
    execute(pageNumber, pageSize, status, role, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const validPageNumber = Math.max(1, pageNumber || 1);
            const validPageSize = Math.max(1, pageSize || 10);
            const skip = (validPageNumber - 1) * validPageSize;
            const filter = {};
            if (role === "vendor" && userId) {
                filter.vendorId = userId;
            }
            else if (role === "client" && userId) {
                filter.clientId = userId;
            }
            if (status === "pending") {
                filter.status = "Pending";
            }
            else if (status === "completed") {
                filter.status = "Completed";
            }
            else if (status === "rescheduled") {
                filter.status = "Rescheduled";
            }
            else if (status === "cancelled") {
                filter.status = "Cancelled";
            }
            else if (status === "confirmed") {
                filter.status = "Confirmed";
            }
            else if (status === "rejected") {
                filter.vendorApproval = "Rejected";
            }
            else if (status === "approved") {
                filter.$and = [{ status: "Pending" }, { vendorApproval: "Approved" }];
            }
            const limit = validPageSize;
            const sort = { createdAt: -1 };
            const { items, total } = yield this._bookingRepository.findAllWithVendorClient(filter, skip, limit, sort);
            const response = {
                bookings: items,
                total: Math.ceil(total / validPageSize),
            };
            return response;
        });
    }
};
exports.GetAllBookingUseCase = GetAllBookingUseCase;
exports.GetAllBookingUseCase = GetAllBookingUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __metadata("design:paramtypes", [Object])
], GetAllBookingUseCase);
//# sourceMappingURL=get-all-booking.usecase.js.map