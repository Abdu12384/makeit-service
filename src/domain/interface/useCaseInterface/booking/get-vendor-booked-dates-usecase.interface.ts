export interface IGetVendorBookedDatesUseCase {
    execute(userId: string): Promise<{dates: {date:string; count:number}[]}>;
}