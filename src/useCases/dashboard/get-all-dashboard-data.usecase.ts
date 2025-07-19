import { inject, injectable } from "tsyringe";
import { IGetAllDashboardDataUseCase } from "../../domain/interface/useCaseInterface/dashboard/get-all-dashboard-data-usecase.interface";
import { IEventRepository } from "../../domain/interface/repositoryInterfaces/event/event-repository.interface";
import { IBookingRepository } from "../../domain/interface/repositoryInterfaces/booking/booking-repository.interface";
import { IVendorRepository } from "../../domain/interface/repositoryInterfaces/users/vendor.repository.interface";
import { ITicketRepository } from "../../domain/interface/repositoryInterfaces/ticket/ticket-repository.interface";
import { IPaymentRepository } from "../../domain/interface/repositoryInterfaces/payment/payment-repository";
import { IClientRepository } from "../../domain/interface/repositoryInterfaces/users/client.repository.interface";
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface";
import { ITransactionRepository } from "../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface";
import { ITransactionsEntity } from "../../domain/entities/transaction.entity";
import { IDashboardStats } from "../../domain/entities/dahboard.entity";










@injectable()
export class GetAllDashboardDataUseCase implements IGetAllDashboardDataUseCase{
    
    constructor(
      @inject("IEventRepository") private _eventRepository : IEventRepository,
      @inject("IBookingRepository") private _bookingRepository : IBookingRepository,
      @inject("IVendorRepository") private _vendorRepository : IVendorRepository,
      @inject("ITicketRepository") private _ticketRepository : ITicketRepository,
      @inject("IClientRepository") private _clientRepository : IClientRepository,
      @inject("IWalletRepository") private _walletRepository : IWalletRepository,
      @inject("ITransactionRepository") private _transactionRepository : ITransactionRepository
    ){}
    
  async execute(role:string,userId:string):Promise<IDashboardStats>{

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


    const wallet = await this._walletRepository.findOne({userId})
    const totalRevenue = wallet?.balance || 0

    let walletTransactions:ITransactionsEntity[]= [];
    if (wallet && wallet.walletId) {
      const rawTransactions = await this._transactionRepository.find({walletId:wallet.walletId});
      walletTransactions = rawTransactions.map((tx:any) => ({
        _id: tx._id.toString(), 
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
     
    const sort = {createdAt:-1 as -1}
    const skip = 0
    const limit = 5
    const filter = {vendorId:userId}

    const recentBookings = await this._bookingRepository.findAllWithVendorClient(filter,skip,limit,sort)
    const recentTickets = await this._ticketRepository.findAllLatestTicket(filter,skip,limit,sort)


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
      recentBookings : recentBookings?.items,
      totalTickets,
      recentTickets : recentTickets?.items
     };
    }
}
    