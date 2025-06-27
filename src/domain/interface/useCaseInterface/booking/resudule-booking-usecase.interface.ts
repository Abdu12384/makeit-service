export interface IRescheduleBookingUseCase {
    execute(
        bookingId: string,
        selectedDate: string,
        rescheduleReason: string,
    ): Promise<void>
    approveOrRejectRescheduleBooking(
        bookingId: string,
        status: string,
    ): Promise<void>
}