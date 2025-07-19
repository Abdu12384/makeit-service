import { IBookingEntity } from "./booking.entity";
import { ITicketEntity } from "./ticket.entity";
import { ITransactionsEntity } from "./transaction.entity";

export interface IDashboardStats {
  totalEvents: number;
  totalClients: number;
  totalRevenue: number;
  totalBookings: number;
  totalVendors: number;
  transactions: ITransactionsEntity[];
  recentBookings: IBookingEntity[]; 
  totalTickets: number;
  recentTickets: ITicketEntity[];
}