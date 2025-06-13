import { IBookingEntity } from "../../../entities/booking.entity";

export interface IUpdateBookingStatusUseCase {
    execute(
        bookingId: string,
        status: string,
        reason?: string,
    ): Promise<void>
}