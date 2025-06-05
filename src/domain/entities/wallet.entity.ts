import { ObjectId } from "mongoose";

export interface IWalletEntity {
    _id?: ObjectId;
    walletId: string;
    balance: number;
    createdAt?: Date;
    userId: ObjectId | string;
    userModel?:string
}
