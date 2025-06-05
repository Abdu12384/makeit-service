import { ObjectId } from "mongoose";

export interface IBookingEntity {
    bookingId?: string;
    serviceId: string;
    clientId: string;
    vendorId: string;
    date: Date;
    email: string;
    phone: string;
    vendorApproval: string
    paymentStatus: string;
    rejectionReason?: string
    status: string
    createdAt: Date
    isComplete: boolean
}