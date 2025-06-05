export interface IUpdateBookingStatusUseCase {
    execute(
        bookingId: string,
        status: string,
        reason?: string,
    ): Promise<any>
}