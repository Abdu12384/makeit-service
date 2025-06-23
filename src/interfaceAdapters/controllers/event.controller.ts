import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
import { IEventController } from "../../domain/interface/controllerInterfaces/event/event-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { ICreateEventUseCase } from "../../domain/interface/useCaseInterface/event/create-event-usecase.interface.js";
import { IGetEventsByVendorIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-by-vendorId-usecase.interface.js";
import { IEditEventUseCase } from "../../domain/interface/useCaseInterface/event/edit-event-usecase.interface.js";
import { IGetAllEventsUseCase } from "../../domain/interface/useCaseInterface/event/get-all-events-usecase.interface.js";
import { IGetEventByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-event-by-id-usecase.interface.js";
import { IGetEventsAttendeesByIdUseCase } from "../../domain/interface/useCaseInterface/event/get-events-attendees-by-id-usecase.interface.js";
import { ICheckEventBookingAvliblityUseCase } from "../../domain/interface/useCaseInterface/event/check-event-booking-avliblity-usecase.interface.js";
import { IBlockEventUseCase } from "../../domain/interface/useCaseInterface/event/block-event-usecase.interface.js";





@injectable()
export class EventController implements IEventController{
    constructor(
      @inject("ICreateEventUseCase") 
      private _createEventUseCase: ICreateEventUseCase,
      @inject("IGetEventsByVendorIdUseCase")
      private _getEventsByVendorIdUseCase: IGetEventsByVendorIdUseCase,
      @inject("IEditEventUseCase")
      private _editEventUseCase: IEditEventUseCase,
      @inject("IGetAllEventsUseCase")
      private _getAllEventsUseCase: IGetAllEventsUseCase,
      @inject("IGetEventByIdUseCase")
      private _getEventByIdUseCase: IGetEventByIdUseCase,
      @inject("IGetEventsAttendeesByIdUseCase")
      private _getEventsAttendeesByIdUseCase: IGetEventsAttendeesByIdUseCase,
      @inject("ICheckEventBookingAvliblityUseCase")
      private _checkEventBookingAvliblityUseCase: ICheckEventBookingAvliblityUseCase,
      @inject("IBlockEventUseCase")
      private _blockEventUseCase: IBlockEventUseCase
    ){}
      



// ══════════════════════════════════════════════════════════
//  Create Event 
// ══════════════════════════════════════════════════════════


    async createEvent(req:Request,res:Response):Promise<void>{
      try {
        const data = req.body
        const {userId,role} = (req as CustomRequest).user

      const event = await this._createEventUseCase.execute(
        data,
        userId
      )
        console.log(data)
        res.status(HTTP_STATUS.OK).json({
          success:true,
          message:"Event Created"
        })
      } catch (error) {
        handleErrorResponse(res,error)
      }
    }






// ══════════════════════════════════════════════════════════
//  Get All Events 
// ══════════════════════════════════════════════════════════

    async getAllEvents(req:Request,res:Response):Promise<void>{
      try {
        const {page,limit,search} = req.query
        const pageNumber = Number(page)
        const pageSize = Number(limit)
        const searchTermString = typeof search === "string" ? search : ""
        const events = await this._getAllEventsUseCase.execute(
          pageNumber,
          pageSize,
          searchTermString
        )
        res.status(HTTP_STATUS.OK).json({
          success:true,
          events,
        })
      } catch (error) {
        handleErrorResponse(res,error)
      }
    }



// ══════════════════════════════════════════════════════════
//  Get All Events By Vendor Id 
// ══════════════════════════════════════════════════════════


    async getAllEventsByVendorId(req:Request,res:Response):Promise<void>{
      try {
        const {userId,role} = (req as CustomRequest).user
        const {page ,limit } = req.query
        const pageNumber = Number(page)
        const pageSize = Number(limit)

        const events = await this._getEventsByVendorIdUseCase.execute(
          userId,
          pageNumber,
          pageSize
        )
        res.status(HTTP_STATUS.OK).json({
          success:true,
          events
        })
      } catch (error) {
        handleErrorResponse(res,error)
      }
    }





// ══════════════════════════════════════════════════════════
//  Edit Event 
// ══════════════════════════════════════════════════════════

    async editEvent(req:Request,res:Response):Promise<void>{
      try {
        const {eventId} = req.params
        const data = req.body
        const event = await this._editEventUseCase.execute(
          eventId,
          data
        )
        res.status(HTTP_STATUS.OK).json({
          success:true,
          message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
          event
        })
      } catch (error) {
        handleErrorResponse(res,error)
      }
    }




// ══════════════════════════════════════════════════════════
//  Block Event 
// ══════════════════════════════════════════════════════════

    async blockEvent(req:Request,res:Response):Promise<void>{
      try {
        const {eventId} = req.params
        const event = await this._blockEventUseCase.blockEvent(
          eventId
        )
        res.status(HTTP_STATUS.OK).json({
          success:true,
          message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
          event
        })
      } catch (error) {
        handleErrorResponse(res,error)
      }
    }


// ══════════════════════════════════════════════════════════
//  Check Event Booking Availability 
// ══════════════════════════════════════════════════════════

    async checkEventBookingAvailability(req:Request,res:Response):Promise<void>{
      try {
        const {eventId} = req.params
        const {ticketCount} = req.query
        console.log('ticketCount',ticketCount)
        const {userId} = (req as CustomRequest).user
        const event = await this._checkEventBookingAvliblityUseCase.execute(
          eventId,
          userId,
          Number(ticketCount)
        )
        res.status(HTTP_STATUS.OK).json({
          success:true,
          event
        })
      } catch (error) {
        handleErrorResponse(res,error)
      }
    }


// ══════════════════════════════════════════════════════════
//  Get Event By Id 
// ══════════════════════════════════════════════════════════

    async getEventById(req:Request,res:Response):Promise<void>{
      try {
        const {eventId} = req.params
        const event = await this._getEventByIdUseCase.execute(
          eventId
        )
        res.status(HTTP_STATUS.OK).json({
          success:true,
          event
        })
      } catch (error) {
        handleErrorResponse(res,error)
      }
    }




// ══════════════════════════════════════════════════════════
//  Get All Events By Vendor Id 
// ══════════════════════════════════════════════════════════

    async getAttendeesById(req:Request,res:Response):Promise<void>{
      try {
        const {eventId} = req.params
        const attendees = await this._getEventsAttendeesByIdUseCase.execute(
          eventId
        )
        res.status(HTTP_STATUS.OK).json({
          success:true,
          attendees
        })
      } catch (error) {
        handleErrorResponse(res,error)
      }
    }


}