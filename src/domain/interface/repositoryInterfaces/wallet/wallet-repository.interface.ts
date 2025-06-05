import { IBaseRepository } from "../base-repository.interface";
import { IWalletEntity } from "../../../../domain/entities/wallet.entity";

export interface IWalletRepository extends IBaseRepository<IWalletEntity> {
    updateWallet(userId:string,amount:number): Promise<any>
    reduceMoney(userId:string,amount:number): Promise<any>
}
