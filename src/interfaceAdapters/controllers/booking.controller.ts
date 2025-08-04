import { inject, injectable } from "tsyringe";
import { IBookingController } from "../../domain/interface/controllerInterfaces/booking/booking-controller.interface";
import {  HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";  
import { handleErrorResponse } from "../../shared/utils/error.handler";
import { ICreateBookingUseCase } from "../../domain/interface/useCaseInterface/booking/create-booking-usecase.interface";
import { IGetAllBookingUseCase } from "../../domain/interface/useCaseInterface/booking/get-all-booking-usecase.interface";
import { IUpdateBookingStatusUseCase } from "../../domain/interface/useCaseInterface/booking/update-booking-status-usecase.interface";
import { ICancelBookingUseCase } from "../../domain/interface/useCaseInterface/booking/cancel-booking-usecase.interface";
import { IRescheduleBookingUseCase } from "../../domain/interface/useCaseInterface/booking/resudule-booking-usecase.interface";
import { IGetVendorBookedDatesUseCase } from "../../domain/interface/useCaseInterface/booking/get-vendor-booked-dates-usecase.interface";




@injectable()
export class BookingController implements IBookingController{
    constructor(
    @inject("ICreateBookingUseCase") 
    private _createBookingUseCase: ICreateBookingUseCase,
    @inject("IGetAllBookingUseCase") 
    private _getAllBookingUseCase: IGetAllBookingUseCase,
    @inject("IUpdateBookingStatusUseCase") 
    private _updateBookingStatusUseCase: IUpdateBookingStatusUseCase,  
    @inject("ICancelBookingUseCase") 
    private _cancelBookingUseCase: ICancelBookingUseCase, 
    @inject("IRescheduleBookingUseCase") 
    private _rescheduleBookingUseCase: IRescheduleBookingUseCase,
    @inject("IGetVendorBookedDatesUseCase") 
    private _getVendorBookedDatesUseCase: IGetVendorBookedDatesUseCase,

    ){}






// ══════════════════════════════════════════════════════════
//  Book Service
// ══════════════════════════════════════════════════════════


   async bookService(req:Request,res:Response): Promise<void>{
        try {
           const {serviceId} = req.params
           const {date,email,phone,vendorId} = req.body
           const {userId} = (req as CustomRequest).user 
         const booking = await this._createBookingUseCase.execute(
            serviceId,
            date,
            email,
            phone,
            vendorId,
            userId,
         )

         res.status(HTTP_STATUS.OK).json({
            success:true,
            booking,
            message:SUCCESS_MESSAGES.BOOKING_SUCCESS
         })


        } catch (error) {
            handleErrorResponse(req,res, error)
        }
    }


    
    // ══════════════════════════════════════════════════════════
    //  Get All Bookings
    // ══════════════════════════════════════════════════════════

     async getAllBookings(req:Request,res:Response): Promise<void>{
        try {
            const {page,limit,status} = req.query
            const {role,userId} = (req as CustomRequest).user 
            const pageNumber = Number(page)
            const pageSize = Number(limit)
            const bookings = await this._getAllBookingUseCase.execute(
                pageNumber,
                pageSize,
                status as string,
                role,
                userId  
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                bookings,
            })
        } catch (error) {
            handleErrorResponse(req,res, error)
        }
    }   




    // ══════════════════════════════════════════════════════════
    //  Get All Bookings
    // ══════════════════════════════════════════════════════════

     async updateBookingStatus(req:Request,res:Response): Promise<void>{
        try {
            const {bookingId} = req.params
            const {status,reason} = req.body
            const booking = await this._updateBookingStatusUseCase.execute(
                bookingId,
                status,
                reason,
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
                booking,
            })
        } catch (error) {
            handleErrorResponse(req,res, error)
        }
    }


    // ══════════════════════════════════════════════════════════
    //  Cancel Booking
    // ══════════════════════════════════════════════════════════

     async cancelBooking(req:Request,res:Response): Promise<void>{
        try {
            const {bookingId} = req.params

            const booking = await this._cancelBookingUseCase.execute(
                bookingId,
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
                booking,
            })
        } catch (error) {
            handleErrorResponse( req,res, error)
        }
    }


    // ══════════════════════════════════════════════════════════
    //  Reschedule Booking
    // ══════════════════════════════════════════════════════════

     async rescheduleBooking(req:Request,res:Response): Promise<void>{
        try {
            const {bookingId} = req.params
            const {selectedDate,rescheduleReason} = req.body
            const booking = await this._rescheduleBookingUseCase.execute(
                bookingId,
                selectedDate,
                rescheduleReason,
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
                booking,
            })
        } catch (error) {
            handleErrorResponse(req,res, error)
        }
    }

    // ══════════════════════════════════════════════════════════
    //  Approve or Reject Reschedule Booking
    // ══════════════════════════════════════════════════════════

     async approveOrRejectRescheduleBooking(req:Request,res:Response): Promise<void>{
        try {
            const {bookingId} = req.params
            const {status} = req.body
            const booking = await this._rescheduleBookingUseCase.approveOrRejectRescheduleBooking(
                bookingId,
                status,
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
                booking,
            })
        } catch (error) {
            handleErrorResponse(req,res, error)
        }
    }

    // ══════════════════════════════════════════════════════════
    //  Vendor Booked Dates
    // ══════════════════════════════════════════════════════════

     async getBookedDates(req:Request,res:Response): Promise<void>{
        try {
            const {role,userId} = (req as CustomRequest).user 
            const booking = await this._getVendorBookedDatesUseCase.execute(
                userId,
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
                booking,
            })
        } catch (error) {
            handleErrorResponse(req,res, error)
        }
    }
    
}