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
    ticketStatus: 'used' | 'refunded' | 'unused'
    paymentTransactionId: string
    checkInHistory?: Date[]
}
