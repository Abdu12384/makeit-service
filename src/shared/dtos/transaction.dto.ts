import { Expose, Exclude } from "class-transformer";

@Exclude()
export class TransactionDTO {
  @Expose() _id!: string;
  @Expose() amount!: string;
  @Expose() currency!: string;
  @Expose() paymentStatus!: string;
  @Expose() paymentType!: string;
  @Expose() walletId!: string;
  @Expose() date!: string;
  @Expose() createdAt!: string;
  @Expose() updatedAt!: string;
  @Expose() relatedTitle!: string; 
  
  constructor(partial: Partial<TransactionDTO>) {
    Object.assign(this, partial);
  }
}