
import { Request, Response } from "express";

export interface IWalletController {
   getWalletById(req:Request,res:Response):Promise<void>
}
