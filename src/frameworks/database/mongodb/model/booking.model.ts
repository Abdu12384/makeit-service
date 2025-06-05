import { model, ObjectId } from "mongoose";
import { bookingSchema } from "../schema/booking.schema.js";
import { IBookingEntity } from "../../../../domain/entities/booking.entity.js";




export  interface IBookingModel extends IBookingEntity, Document{
    _id: ObjectId   
}

export const BookingModel = model<IBookingModel>("Booking",bookingSchema)
