import { ObjectId } from "mongoose";
import { IPaymentEntity } from "../../../../domain/entities/payment.entity.js";
import { model } from "mongoose";
import { paymentSchema } from "../schema/payment.schema.js";

export interface IPaymentModel extends IPaymentEntity {
    _id: ObjectId
}

export const paymentModel = model<IPaymentModel>('payment', paymentSchema)