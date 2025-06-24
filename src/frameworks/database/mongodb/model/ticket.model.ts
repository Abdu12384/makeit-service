import { model, ObjectId, Document } from "mongoose";
import { ITicketEntity } from "../../../../domain/entities/ticket.entity";
import { ticketSchema } from "../schema/ticket.schema";




export interface ITicketModel extends ITicketEntity, Document{
    _id: ObjectId
} 


export const ticketModel = model<ITicketModel>('ticket', ticketSchema);  