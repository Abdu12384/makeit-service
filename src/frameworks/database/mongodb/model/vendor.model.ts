import { model, ObjectId } from "mongoose";
import { IVendorEntity } from "../../../../domain/entities/vendor.entity";
import { VendorSchema } from "../schema/vendor.schema";
import { Document } from "mongoose";


export interface IVendorModel extends Omit<IVendorEntity,"_id" >, Document{
   _id: ObjectId;
}

export const VendorModel = model<IVendorModel>("vendor",VendorSchema)