import { ObjectId } from "mongoose";

export interface IPaymentEntity {
    _id?: ObjectId
    clientId: ObjectId | string;
    receiverId: ObjectId | string;
    bookingId?: ObjectId | string;
    ticketId?:string;
    amount: number;
    currency: string;
    purpose: 'ticketBooking' | 'serviceBooking'
    status: 'pending' | 'success' | 'failed';
    paymentId: string;
    createdAt?: Date
}