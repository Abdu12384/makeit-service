import { Request, Response } from "express";  
export interface IEventController{
  createEvent(req:Request,res:Response):Promise<void>
  getAllEvents(req:Request,res:Response):Promise<void>
  getAllEventsByVendorId(req:Request,res:Response):Promise<void>
  editEvent(req:Request,res:Response):Promise<void>
  getEventById(req:Request,res:Response):Promise<void>
  getAttendeesById(req:Request,res:Response):Promise<void>
  checkEventBookingAvailability(req:Request,res:Response):Promise<void>
  blockEvent(req:Request,res:Response):Promise<void>
  getAllEventsByLocation(req:Request,res:Response):Promise<void>
}
