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
exports.GetAllDashboardDataUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let GetAllDashboardDataUseCase = class GetAllDashboardDataUseCase {
    constructor(_eventRepository, _bookingRepository, _vendorRepository, _ticketRepository, _clientRepository, _walletRepository, _transactionRepository) {
        this._eventRepository = _eventRepository;
        this._bookingRepository = _bookingRepository;
        this._vendorRepository = _vendorRepository;
        this._ticketRepository = _ticketRepository;
        this._clientRepository = _clientRepository;
        this._walletRepository = _walletRepository;
        this._transactionRepository = _transactionRepository;
    }
    execute(role, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let events = yield this._eventRepository.find();
            let bookings = yield this._bookingRepository.find();
            let vendors = yield this._vendorRepository.find();
            let tickets = yield this._ticketRepository.find();
            const clients = yield this._clientRepository.find();
            // Role-based filtering
            if (role === "vendor") {
                events = events.filter((event) => event.hostedBy === userId);
                bookings = bookings.filter((booking) => booking.vendorId === userId);
                tickets = tickets.filter((ticket) => {
                    const event = events.find((e) => e.eventId === ticket.eventId);
                    return event && event.hostedBy === userId;
                });
                vendors = vendors.filter((vendor) => vendor.userId === userId);
            }
            const wallet = yield this._walletRepository.findOne({ userId });
            const totalRevenue = (wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0;
            let walletTransactions = [];
            if (wallet && wallet.walletId) {
                const rawTransactions = yield this._transactionRepository.find({ walletId: wallet.walletId });
                walletTransactions = rawTransactions.map((tx) => {
                    var _a, _b, _c;
                    return ({
                        _id: tx._id.toString(),
                        amount: tx.amount,
                        currency: tx.currency || "INR",
                        paymentStatus: tx.paymentStatus,
                        paymentType: tx.paymentType,
                        walletId: tx.walletId,
                        date: (_a = tx.date) === null || _a === void 0 ? void 0 : _a.toISOString(),
                        createdAt: (_b = tx.createdAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
                        updatedAt: (_c = tx.updatedAt) === null || _c === void 0 ? void 0 : _c.toISOString(),
                    });
                });
            }
            const sort = { createdAt: -1 };
            const skip = 0;
            const limit = 5;
            const filter = { vendorId: userId };
            const recentBookings = yield this._bookingRepository.findAllWithVendorClient(filter, skip, limit, sort);
            const recentTickets = yield this._ticketRepository.findAllLatestTicket(filter, skip, limit, sort);
            // Aggregate metrics
            const totalEvents = events.length;
            const totalClients = clients.length;
            const totalBookings = bookings.length;
            const totalVendors = vendors.length;
            const totalTickets = tickets.length;
            return {
                totalEvents,
                totalClients,
                totalRevenue,
                totalBookings,
                totalVendors,
                transactions: walletTransactions,
                recentBookings: recentBookings === null || recentBookings === void 0 ? void 0 : recentBookings.items,
                totalTickets,
                recentTickets: recentTickets === null || recentTickets === void 0 ? void 0 : recentTickets.items
            };
        });
    }
};
exports.GetAllDashboardDataUseCase = GetAllDashboardDataUseCase;
exports.GetAllDashboardDataUseCase = GetAllDashboardDataUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IEventRepository")),
    __param(1, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(2, (0, tsyringe_1.inject)("IVendorRepository")),
    __param(3, (0, tsyringe_1.inject)("ITicketRepository")),
    __param(4, (0, tsyringe_1.inject)("IClientRepository")),
    __param(5, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(6, (0, tsyringe_1.inject)("ITransactionRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], GetAllDashboardDataUseCase);
//# sourceMappingURL=get-all-dashboard-data.usecase.js.map