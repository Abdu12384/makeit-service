import { Request, Response } from "express";

export interface ITicketController {
    createTicket(req: Request, res: Response): Promise<void>;
    confirmTicketAndPayment(req: Request, res: Response): Promise<void>;
    getAllTicketsByClientId(req: Request, res: Response): Promise<void>;
    verifyTicket(req: Request, res: Response): Promise<void>;
    cancelTicket(req: Request, res: Response): Promise<void>;
    purchaseTicketWithWallet(req: Request, res: Response): Promise<void>;
}