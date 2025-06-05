import { model, ObjectId } from "mongoose";
import { IVendorEntity } from "../../../../domain/entities/vendor.entity.js";
import { VendorSchema } from "../schema/vendor.schema.js";


export interface IVendorModel extends IVendorEntity, Document{
   _id: ObjectId;
}

export const VendorModel = model<IVendorModel>("vendor",VendorSchema)