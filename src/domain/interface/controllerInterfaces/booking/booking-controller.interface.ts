import { Request, Response } from "express";
export interface IBookingController{
    bookService(req:Request,res:Response): Promise<void>
    getAllBookings(req:Request,res:Response): Promise<void>
    updateBookingStatus(req:Request,res:Response): Promise<void>
    cancelBooking(req:Request,res:Response): Promise<void>
    rescheduleBooking(req:Request,res:Response): Promise<void>
    approveOrRejectRescheduleBooking(req:Request,res:Response): Promise<void>
    getBookedDates(req:Request,res:Response): Promise<void>
}