import { model, ObjectId, Document } from "mongoose";
import { IOtpEntity } from "../../../../domain/entities/otp.entity";
import { otpSchema } from "../schema/otp.schema";



export interface IOtpModel extends IOtpEntity, Document {
	_id: ObjectId;
}


export const otpModel = model<IOtpModel>("Otp",otpSchema)