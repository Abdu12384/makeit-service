import { ITransactionsEntity } from "../../../entities/transaction.entity";
import { IWalletEntity } from "../../../entities/wallet.entity";

export interface IGetWalletByIdUseCase{
    execute(userId:string,pageNumber:number,pageSize:number):Promise<{wallet:IWalletEntity,transaction:ITransactionsEntity[],total:number}> 
}