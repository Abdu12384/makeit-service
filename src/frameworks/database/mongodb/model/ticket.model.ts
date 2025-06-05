import { model, ObjectId, Document } from "mongoose";
import { ITicketEntity } from "../../../../domain/entities/ticket.entity.js";
import { ticketSchema } from "../schema/ticket.schema.js";




export interface ITicketModel extends ITicketEntity, Document{
    _id: ObjectId
} 


export const ticketModel = model<ITicketModel>('ticket', ticketSchema);  