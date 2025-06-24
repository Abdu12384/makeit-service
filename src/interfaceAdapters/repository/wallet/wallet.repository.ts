import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository";
import { IWalletModel } from "../../../frameworks/database/mongodb/model/wallet.model";
import { IWalletRepository } from "../../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface";
import { walletModel } from "../../../frameworks/database/mongodb/model/wallet.model";




@injectable()
export  class WalletRepository extends BaseRepository<IWalletModel> implements IWalletRepository {
    constructor() {
        super(walletModel)
    }

    async updateWallet(userId:string,amount:number){
        await this.model.updateOne({userId},{ $inc: { balance: amount } })
         return this.model.findOne({userId})
    }
    
     async reduceMoney(userId:string,amount:number){
         await this.model.updateOne({userId},{ $inc: { balance: -amount } })
         return this.model.findOne({userId})
    }
}