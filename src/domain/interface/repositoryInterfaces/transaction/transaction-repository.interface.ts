import { IBaseRepository } from "../base-repository.interface";
import { ITransactionModel } from "../../../../frameworks/database/mongodb/model/transaction.model";



export interface ITransactionRepository extends IBaseRepository<ITransactionModel> {}
