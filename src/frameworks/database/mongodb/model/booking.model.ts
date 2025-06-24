import { model, ObjectId } from "mongoose";
import { bookingSchema } from "../schema/booking.schema";
import { IBookingEntity } from "../../../../domain/entities/booking.entity";




export  interface IBookingModel extends IBookingEntity, Document{
    _id: ObjectId   
}

export const BookingModel = model<IBookingModel>("Booking",bookingSchema)
