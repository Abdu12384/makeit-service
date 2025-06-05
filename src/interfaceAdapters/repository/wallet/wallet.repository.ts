import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import { IWalletModel } from "../../../frameworks/database/mongodb/model/wallet.model.js";
import { IWalletRepository } from "../../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface.js";
import { walletModel } from "../../../frameworks/database/mongodb/model/wallet.model.js";




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