import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { handleErrorResponse } from "../../shared/utils/error.handler";
import { HTTP_STATUS } from "../../shared/constants";
import { SUCCESS_MESSAGES } from "../../shared/constants";
import { ITicketController } from "../../domain/interface/controllerInterfaces/ticket/ticket-controller";
import { ICreateTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/create-ticket-usecase.interface";
import { IConfirmTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/confirm-ticket-usecase.interface";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IGetAllTicketsByIdUseCase } from "../../domain/interface/useCaseInterface/ticket/get-all-tickets-by-id-usecase.interface";
import { IVerifyTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/varify-ticket-usecase.inteface";
import { ICancelTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/cancel-ticket-usecase.interface";












@injectable()
export class TicketController implements ITicketController {
    
    constructor(
      @inject("ICreateTicketUseCase")
      private _createTicketUseCase: ICreateTicketUseCase,
      @inject("IConfirmTicketUseCase")
      private _confirmTicketUseCase: IConfirmTicketUseCase,
      @inject("IGetAllTicketsByIdUseCase")
      private _getAllTicketsByIdUseCase: IGetAllTicketsByIdUseCase,
      @inject("IVerifyTicketUseCase")
      private _verifyTicketUseCase: IVerifyTicketUseCase,
      @inject("ICancelTicketUseCase")
      private _cancelTicketUseCase: ICancelTicketUseCase,
    ){}



// ══════════════════════════════════════════════════════════
//  Create Ticket 
// ══════════════════════════════════════════════════════════
  async createTicket(req: Request, res: Response): Promise<void> {
        try {

        const {ticket,email,phone,eventId,paymentIntentId,totalAmount,totalCount,vendorId} = req.body
        const {userId:clientId,role} = (req as CustomRequest).user 

        
        const {stripeClientId, createdTicket} = await this._createTicketUseCase.execute(
            ticket,
            paymentIntentId,
            totalAmount,
            totalCount,
            vendorId,
            clientId,
            eventId,
            email,
            phone
            )

        res.status(HTTP_STATUS.OK).json({
            success:true,
            stripeClientId,
            createdTicket,
        })
            
        } catch (error) {
            handleErrorResponse(res, error)
        }
    }




    
// ══════════════════════════════════════════════════════════
//  Confirm Payment 
// ══════════════════════════════════════════════════════════


    async confirmTicketAndPayment(req: Request, res: Response): Promise<void> {
        try {
            const {ticket, paymentIntentId, vendorId} = req.body
            const confirmTicket = await this._confirmTicketUseCase.execute(
                ticket,
                paymentIntentId,
                vendorId,
            )

            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.TICKET_CONFIRMED,
                confirmTicket,
            })
        } catch (error) {
            handleErrorResponse(res, error)
        }
    }


// ══════════════════════════════════════════════════════════
//  Get All Tickets ById 
// ══════════════════════════════════════════════════════════

    async getAllTicketsByClientId(req: Request, res: Response): Promise<void> {
        try {
            const {userId} = (req as CustomRequest).user
            const {page,limit} = req.query
            const pageNumber = Number(page)
            const pageSize = Number(limit)
            const tickets = await this._getAllTicketsByIdUseCase.execute(
              userId,
              pageNumber,
              pageSize
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                tickets,
            })
        } catch (error) {
            handleErrorResponse(res, error)
        }
    }



// ══════════════════════════════════════════════════════════
//  Verify Ticket 
// ══════════════════════════════════════════════════════════

    async verifyTicket(req: Request, res: Response): Promise<void> {
        try {
            const {ticketId,eventId} = req.params
            const verifyTicket = await this._verifyTicketUseCase.execute(
                ticketId,
                eventId,
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
                verifyTicket,
            })
        } catch (error) {
            handleErrorResponse(res, error)
        }
    }




// ══════════════════════════════════════════════════════════
//  Create Ticket 
// ══════════════════════════════════════════════════════════

    async cancelTicket(req: Request, res: Response): Promise<void> {
        const {ticketId} = req.params
        const {cancelCount} = req.body
        try {

            const cancelTicket = await this._cancelTicketUseCase.execute(
                ticketId,
                cancelCount,
            )
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.UPDATE_SUCCESS,
                cancelTicket,
            })
            
        } catch (error) {
            handleErrorResponse(res, error)
        }
    }

}
