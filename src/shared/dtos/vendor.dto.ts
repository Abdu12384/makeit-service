import { Expose, Exclude } from "class-transformer";

@Exclude()
export class VendorDTO {
  @Expose() userId!: string;
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() phone!: string;
  @Expose() idProof!: string;
  @Expose() vendorStatus!: string;
  @Expose() createdAt!: string;
  @Expose() role!: string;
  @Expose() status!: string;
 
  constructor(partial: Partial<VendorDTO>) {
    Object.assign(this, partial);
  }
}
