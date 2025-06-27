import { ObjectId } from "mongoose";

export interface ITransactionsEntity {
    _id?: ObjectId;
    walletId: ObjectId | string;
    currency: string;
    paymentStatus: "debit" | "credit";
    amount: number;
    date?: Date;
    paymentType: "refund" | "ticketBooking" | "top-up" | "adminCommission" | "serviceBooking"| "advancePayment"   
}