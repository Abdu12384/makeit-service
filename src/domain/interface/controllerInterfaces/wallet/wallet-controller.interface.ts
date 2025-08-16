
import { Request, Response } from "express";

export interface IWalletController {
   getWalletById(req:Request,res:Response):Promise<void>
   getWalletAmount(req:Request,res:Response):Promise<void>
   walletPayment(req:Request,res:Response):Promise<void>
}
