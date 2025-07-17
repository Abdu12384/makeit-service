import { TransactionDTO } from "../../../../shared/dtos/transaction.dto";
import { WalletDTO } from "../../../../shared/dtos/wallet.dto";

export interface IGetWalletByIdUseCase{
    execute(userId:string,pageNumber:number,pageSize:number):Promise<{wallet:WalletDTO,transaction:TransactionDTO[],total:number}> 
}