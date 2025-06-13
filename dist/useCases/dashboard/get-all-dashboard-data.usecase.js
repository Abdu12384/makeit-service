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
let GetAllDashboardDataUseCase = class GetAllDashboardDataUseCase {
    _eventRepository;
    _bookingRepository;
    _vendorRepository;
    _ticketRepository;
    _clientRepository;
    _walletRepository;
    _transactionRepository;
    constructor(_eventRepository, _bookingRepository, _vendorRepository, _ticketRepository, _clientRepository, _walletRepository, _transactionRepository) {
        this._eventRepository = _eventRepository;
        this._bookingRepository = _bookingRepository;
        this._vendorRepository = _vendorRepository;
        this._ticketRepository = _ticketRepository;
        this._clientRepository = _clientRepository;
        this._walletRepository = _walletRepository;
        this._transactionRepository = _transactionRepository;
    }
    async execute(role, userId) {
        let events = await this._eventRepository.find();
        let bookings = await this._bookingRepository.find();
        let vendors = await this._vendorRepository.find();
        let tickets = await this._ticketRepository.find();
        let clients = await this._clientRepository.find();
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
        const wallet = await this._walletRepository.findOne({ userId });
        const totalRevenue = wallet?.balance || 0;
        let walletTransactions = [];
        if (wallet && wallet.walletId) {
            const rawTransactions = await this._transactionRepository.find({ walletId: wallet.walletId });
            walletTransactions = rawTransactions.map((tx) => ({
                _id: tx._id.toString(), // Convert MongoDB ObjectId to string
                amount: tx.amount,
                currency: tx.currency || "INR",
                paymentStatus: tx.paymentStatus,
                paymentType: tx.paymentType,
                walletId: tx.walletId,
                date: tx.date?.toISOString(),
                createdAt: tx.createdAt?.toISOString(),
                updatedAt: tx.updatedAt?.toISOString(),
            }));
        }
        const sort = { createdAt: -1 };
        const skip = 0;
        const limit = 5;
        const filter = { vendorId: userId };
        const recentBookings = await this._bookingRepository.findAllWithVendorClient(filter, skip, limit, sort);
        console.log("recentBookings", JSON.stringify(recentBookings, null, 2));
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
            recentBookings: recentBookings?.items,
            totalTickets
        };
    }
};
GetAllDashboardDataUseCase = __decorate([
    injectable(),
    __param(0, inject("IEventRepository")),
    __param(1, inject("IBookingRepository")),
    __param(2, inject("IVendorRepository")),
    __param(3, inject("ITicketRepository")),
    __param(4, inject("IClientRepository")),
    __param(5, inject("IWalletRepository")),
    __param(6, inject("ITransactionRepository")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], GetAllDashboardDataUseCase);
export { GetAllDashboardDataUseCase };
//# sourceMappingURL=get-all-dashboard-data.usecase.js.map