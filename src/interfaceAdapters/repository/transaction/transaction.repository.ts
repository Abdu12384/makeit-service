import { injectable } from "tsyringe";
import { ITransactionRepository } from "../../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface";
import { ITransactionModel, transactionModel } from "../../../frameworks/database/mongodb/model/transaction.model";
import { BaseRepository } from "../base.repository";



@injectable()
export class TransactionRepository extends BaseRepository<ITransactionModel> implements ITransactionRepository {
    constructor() {
        super(transactionModel)
    }
} 