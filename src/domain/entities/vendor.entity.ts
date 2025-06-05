import { User } from "./user.entity";

export interface IVendorEntity extends User{
    idProof: string,
    vendorId: string,
    vendorStatus:'pending'| 'approved' | 'rejected'
    rejectionReason?:string,
    aboutVendor?:string
}