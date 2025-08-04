import { Expose, Exclude, Type } from "class-transformer";

@Exclude()
export class BookingDTO {
  @Expose() bookingId!: string;
  @Expose() clientId!: string;

  @Expose()
  @Type(() => Date)
  date!: Date[];

  @Expose() paymentStatus!: "Pending" | "Failed" | "Successfull" | "Refunded" | "AdvancePaid" | "Confirmed";
  @Expose() serviceId!: string;
  @Expose() vendorApproval!: "Pending" | "Approved" | "Rejected";
  @Expose() vendorId!: string;
  @Expose() email!: string;
  @Expose() phone!: string;
  @Expose() rejectionReason?: string;
  @Expose() status!: "Pending" | "Rejected" | "Completed" | "Cancelled" | "Confirmed" | "vendorCancelled" | "Rescheduled";

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose() isComplete!: boolean;
  @Expose() balanceAmount!: number;
  @Expose() rescheduleReason?: string;

  @Expose()
  @Type(() => Date)
  rescheduleDate?: Date;

  @Expose() rescheduleStatus!: "Pending" | "Approved" | "Rejected" | "Requested";
  @Expose() cancellationReason?: string;

  constructor(partial: Partial<BookingDTO>) {
    Object.assign(this, partial);
  }
}
