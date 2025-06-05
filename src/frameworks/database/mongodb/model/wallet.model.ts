import { ObjectId } from "mongoose";
import { model } from "mongoose";
import { walletSchema } from "../schema/wallet.schema.js";
import { IWalletEntity } from "../../../../domain/entities/wallet.entity.js";


export interface IWalletModel extends IWalletEntity {
  _id: ObjectId;
}


export const walletModel = model<IWalletModel>('wallet', walletSchema); 