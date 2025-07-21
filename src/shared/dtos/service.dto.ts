import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ServiceDTO {
  @Expose() additionalHourFee!: number;
  @Expose() cancellationPolicy!: string;
  @Expose() categoryId?: string;
  @Expose() serviceId?: string;
  @Expose() serviceDescription!: string;
  @Expose() serviceDuration!: string;
  @Expose() servicePrice!: number;
  @Expose() serviceTitle!: string;
  @Expose() termsAndCondition!: string;
  @Expose() vendorId!: string;
  @Expose() yearsOfExperience!: number;
  @Expose() status!: 'active' | 'blocked';

  constructor(partial: Partial<ServiceDTO>) {
    Object.assign(this, partial);
  }
}
