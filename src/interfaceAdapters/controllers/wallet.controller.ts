import { inject, injectable } from "tsyringe";
import { IWalletController } from "../../domain/interface/controllerInterfaces/wallet/wallet-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
import { HTTP_STATUS } from "../../shared/constants";
import { handleErrorResponse } from "../../shared/utils/error.handler";
import { IGetWalletByIdUseCase } from "../../domain/interface/useCaseInterface/wallet/get-wallet-by-id-usecase.interface";
import { IGetWalletBalanceUseCase } from "../../domain/interface/useCaseInterface/wallet/get-wallet-balance-usecase.interface";




@injectable()
export class WalletController implements IWalletController{
    
    constructor(
        @inject("IGetWalletByIdUseCase")
        private readonly _getWalletByIdUseCase:IGetWalletByIdUseCase,
        @inject("IGetWalletBalanceUseCase")
        private readonly _getWalletBalanceUseCase:IGetWalletBalanceUseCase
    ){}




    
 // ══════════════════════════════════════════════════════════
 //   Get Wallet By Id
 // ══════════════════════════════════════════════════════════
  

    async getWalletById(req:Request,res:Response):Promise<void>{
        try {
            const {userId} = (req as CustomRequest).user
            const {page,limit} = req.query
            const pageNumber = Number(page)
            const pageSize = Number(limit)
            const wallet = await this._getWalletByIdUseCase.execute(
              userId,
              pageNumber,
              pageSize
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                wallet
            })
        } catch (error) {
            handleErrorResponse(req,res,error)
        }
    }

    async getWalletAmount(req:Request,res:Response):Promise<void>{
        try {
            const {userId} = (req as CustomRequest).user
            const wallet = await this._getWalletBalanceUseCase.execute(
              userId
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                wallet
            })
        } catch (error) {
            handleErrorResponse(req,res,error)
        }
    }
    
    async walletPayment(req:Request,res:Response):Promise<void>{
        try {
            const {userId} = (req as CustomRequest).user
            const wallet = await this._getWalletBalanceUseCase.execute(
              userId
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                wallet
            })
        } catch (error) {
            handleErrorResponse(req,res,error)
        }
    }
        
}