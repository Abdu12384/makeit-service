import { inject, injectable } from "tsyringe"
import { IGetWalletBalanceUseCase } from "../../domain/interface/useCaseInterface/wallet/get-wallet-balance-usecase.interface"
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface"










@injectable()
export class GetWalletBalanceUseCase implements IGetWalletBalanceUseCase{
    
    constructor(
        @inject("IWalletRepository")
        private readonly walletRepository:IWalletRepository
    ){}

    async execute(userId:string):Promise<number>{
        const wallet = await this.walletRepository.findOne({userId})
        if (!wallet) {
            throw new Error("Wallet not found")
        }
        return wallet.balance
    }
}
