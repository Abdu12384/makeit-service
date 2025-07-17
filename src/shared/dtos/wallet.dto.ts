import { Expose, Exclude } from "class-transformer";

@Exclude()
export class WalletDTO {
  @Expose() walletId!: string;
  @Expose() balance!: string;
  @Expose() userId!: string;
  @Expose() userModel!: string;
  @Expose() createdAt!: string;

  constructor(partial: Partial<WalletDTO>) {
    Object.assign(this, partial);
  }
}