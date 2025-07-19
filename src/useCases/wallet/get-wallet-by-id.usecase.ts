import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../domain/interface/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletEntity } from "../../domain/entities/wallet.entity";
import { IGetWalletByIdUseCase } from "../../domain/interface/useCaseInterface/wallet/get-wallet-by-id-usecase.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { ITransactionsEntity } from "../../domain/entities/transaction.entity";
import { ITransactionRepository } from "../../domain/interface/repositoryInterfaces/transaction/transaction-repository.interface";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { WalletDTO } from "../../shared/dtos/wallet.dto";
import { plainToInstance } from "class-transformer";
import { TransactionDTO } from "../../shared/dtos/transaction.dto";








@injectable()
export class GetWalletByIdUseCase implements IGetWalletByIdUseCase{
    
    constructor(
        @inject("IWalletRepository")
        private readonly walletRepository:IWalletRepository,
        @inject("ITransactionRepository")
        private readonly transactionRepository:ITransactionRepository
    ){}

    async execute(userId:string,pageNumber:number,pageSize:number):Promise<{wallet:WalletDTO,transaction:TransactionDTO[],total:number}>{

       const validPageNumber = Math.max(1, pageNumber || 1);
       const validPageSize = Math.max(1, pageSize || 10);
       const skip = (validPageNumber - 1) * validPageSize;
       const limit = validPageSize;
       const sort: Record<string, 1 | -1> = { createdAt: -1 as -1 };

        let wallet = await this.walletRepository.findOne({userId})
        if (!wallet) {
          const walletId = generateUniqueId("wallet")
          const newWallet = {
            walletId,
            userId,
            balance: 0,
            userModel:"client",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          wallet = await this.walletRepository.save(newWallet);
        }
      
        const walletDto = plainToInstance(WalletDTO, wallet, { excludeExtraneousValues: true }); 

        const {items,total} = await this.transactionRepository.findAll({walletId:wallet.walletId},skip,limit,sort)

        const transactions = plainToInstance(TransactionDTO, items as [], { excludeExtraneousValues: true }); 

        

        const response = {
            wallet:walletDto,
            transaction:transactions,
            total:Math.ceil(total/validPageSize)
        }
        return response
    }
}