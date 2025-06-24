import { inject, injectable } from "tsyringe";
import { IBookingController } from "../../domain/interface/controllerInterfaces/booking/booking-controller.interface.js";
import {  HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { Request, Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware.js";  
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { ICreateBookingUseCase } from "../../domain/interface/useCaseInterface/booking/create-booking-usecase.interface.js";
import { IGetAllBookingUseCase } from "../../domain/interface/useCaseInterface/booking/get-all-booking-usecase.interface.js";
import { IUpdateBookingStatusUseCase } from "../../domain/interface/useCaseInterface/booking/update-booking-status-usecase.interface.js";
import { ICancelBookingUseCase } from "../../domain/interface/useCaseInterface/booking/cancel-booking-usecase.interface.js";
import { IRescheduleBookingUseCase } from "../../domain/interface/useCaseInterface/booking/resudule-booking-usecase.interface.js";






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

    ){}






// ══════════════════════════════════════════════════════════
//  Book Service
// ══════════════════════════════════════════════════════════


   async bookService(req:Request,res:Response): Promise<void>{
        try {
           const {serviceId} = req.params
           const {date,email,phone,vendorId} = req.body
           const {userId,role} = (req as CustomRequest).user 
         const booking = await this._createBookingUseCase.execute(
            serviceId,
            date,
            email,
            phone,
            vendorId,
            userId,
         )

         console.log('created booking',booking)
         res.status(HTTP_STATUS.OK).json({
            success:true,
            booking,
            message:SUCCESS_MESSAGES.BOOKING_SUCCESS
         })


        } catch (error) {
            handleErrorResponse(res, error)
        }
    }


    
    // ══════════════════════════════════════════════════════════
    //  Get All Bookings
    // ══════════════════════════════════════════════════════════

     async getAllBookings(req:Request,res:Response): Promise<void>{
        try {
            const {page,limit} = req.query
            const {role,userId} = (req as CustomRequest).user 
            const pageNumber = Number(page)
            const pageSize = Number(limit)
            const bookings = await this._getAllBookingUseCase.execute(
                pageNumber,
                pageSize,
                role,
                userId
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                bookings,
            })
        } catch (error) {
            handleErrorResponse(res, error)
        }
    }   




    // ══════════════════════════════════════════════════════════
    //  Get All Bookings
    // ══════════════════════════════════════════════════════════

     async updateBookingStatus(req:Request,res:Response): Promise<void>{
        try {
            const {bookingId} = req.params
            const {status,reason} = req.body
            console.log('bookingId',bookingId)
            console.log('status',status)
            console.log('reason',reason)
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
            handleErrorResponse(res, error)
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
            handleErrorResponse(res, error)
        }
    }


    // ══════════════════════════════════════════════════════════
    //  Reschedule Booking
    // ══════════════════════════════════════════════════════════

     async rescheduleBooking(req:Request,res:Response): Promise<void>{
        try {
            const {bookingId} = req.params
            const {selectedDate,rescheduleReason} = req.body
            console.log('bookingId',bookingId)
            console.log('selectedDate',selectedDate)
            console.log('rescheduleReason',rescheduleReason)
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
            handleErrorResponse(res, error)
        }
    }
    
}