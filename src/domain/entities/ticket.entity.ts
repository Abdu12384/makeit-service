import { ObjectId } from "mongoose";

export interface ITicketEntity {
    _id?: ObjectId | string
    ticketId: string;
    // createdAt?: Date;
    vendorId: string
    totalAmount: number
    ticketCount: number
    phone: string;
    email: string;
    paymentStatus: 'pending' | 'successfull' | 'failed';   
    qrCodeLink: string;
    eventId: string;
    clientId: string;
    ticketStatus: 'used' | 'refunded' | 'unused'|'partially_refunded'|'cancelled'
    paymentTransactionId: string
    checkedIn?: string
    checkInHistory?: Date[]
    cancellationHistory?: {
        count: number,
        amount: number,
        date: Date
    }[]
}
