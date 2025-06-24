import { ObjectId } from "mongoose";
import { model } from "mongoose";
import { walletSchema } from "../schema/wallet.schema";
import { IWalletEntity } from "../../../../domain/entities/wallet.entity";


export interface IWalletModel extends IWalletEntity {
  _id: ObjectId;
}


export const walletModel = model<IWalletModel>('wallet', walletSchema); 