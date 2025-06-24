import { model, ObjectId } from "mongoose";
import { IVendorEntity } from "../../../../domain/entities/vendor.entity";
import { VendorSchema } from "../schema/vendor.schema";


export interface IVendorModel extends IVendorEntity, Document{
   _id: ObjectId;
}

export const VendorModel = model<IVendorModel>("vendor",VendorSchema)