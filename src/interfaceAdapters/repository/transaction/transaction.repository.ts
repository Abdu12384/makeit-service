import { injectable } from "tsyringe";
import { ITransactionRepository } from "../../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface.js";
import { ITransactionModel, transactionModel } from "../../../frameworks/database/mongodb/model/transaction.model.js";
import { BaseRepository } from "../base.repository.js";



@injectable()
export class TransactionRepository extends BaseRepository<ITransactionModel> implements ITransactionRepository {
    constructor() {
        super(transactionModel)
    }
} 