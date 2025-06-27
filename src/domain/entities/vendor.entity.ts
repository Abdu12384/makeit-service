import { User } from "./user.entity";

export interface IBookedDates {
    date: Date,
    count: number
}

export interface IVendorEntity extends User{
    idProof: string,
    vendorId: string,
    vendorStatus:'pending'| 'approved' | 'rejected'
    rejectionReason?:string,
    aboutVendor?:string,
    fcmToken?:string
    bookedDates?: IBookedDates[],
}