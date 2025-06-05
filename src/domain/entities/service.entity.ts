import { ObjectId } from "mongoose";

export interface IServiceEntity {
    _id?: ObjectId;
    serviceId?: string;
    serviceTitle: string;
    yearsOfExperience: number;
    serviceDescription: string;
    cancellationPolicy: string;
    termsAndCondition: string;
    serviceDuration: string;
    servicePrice: number;
    additionalHourFee: number;
    status: string
    vendorId: string;
    categoryId: string
}