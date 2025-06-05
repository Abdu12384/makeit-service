import { model, ObjectId } from "mongoose";
import { adminSchema } from "../schema/admin.schema.js";
import { IAdminEntity } from "../../../../domain/entities/admin.entity.js";


export interface IAdminModel extends IAdminEntity, Document {
	_id: ObjectId;
}

export const AdminModel = model<IAdminModel>("Admin", adminSchema);
