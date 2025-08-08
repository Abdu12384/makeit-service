import { Expose, Exclude, Type } from "class-transformer";

@Exclude()
export class BookingDTO {
  @Expose() bookingId!: string;
  @Expose() clientId!: string;

  @Expose()
  @Type(() => Date)
  date!: Date[];

  @Expose() paymentStatus!: string;
  @Expose() serviceId!: string;
  @Expose() vendorApproval!: string;
  @Expose() vendorId!: string;
  @Expose() email!: string;
  @Expose() phone!: string;
  @Expose() rejectionReason?: string;
  @Expose() status!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose() isComplete!: boolean;
  @Expose() balanceAmount!: number;
  @Expose() rescheduleReason?: string;

  @Expose()
  @Type(() => Date)
  rescheduleDate?: Date;

  @Expose() rescheduleStatus!: string;
  @Expose() cancellationReason?: string;

  constructor(partial: Partial<BookingDTO>) {
    Object.assign(this, partial);
  }
}
