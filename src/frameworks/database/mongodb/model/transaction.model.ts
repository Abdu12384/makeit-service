import { model } from "mongoose";
import { transactionSchema } from "../schema/transaction.schema"; 
import { ITransactionsEntity } from "../../../../domain/entities/transaction.entity";
import { ObjectId } from "mongoose";


export interface ITransactionModel extends ITransactionsEntity {
  _id: ObjectId;
}


export const transactionModel = model<ITransactionModel>('transaction', transactionSchema);