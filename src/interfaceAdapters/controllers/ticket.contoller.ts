import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { HTTP_STATUS } from "../../shared/constants.js";
import { SUCCESS_MESSAGES } from "../../shared/constants.js";
import { ITicketController } from "../../domain/interface/controllerInterfaces/ticket/ticket-controller.js";
import { ICreateTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/create-ticket-usecase.interface.js";
import { IConfirmTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/confirm-ticket-usecase.interface.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IGetAllTicketsByIdUseCase } from "../../domain/interface/useCaseInterface/ticket/get-all-tickets-by-id-usecase.interface.js";
import { IVerifyTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/varify-ticket-usecase.inteface.js";
import { ICancelTicketUseCase } from "../../domain/interface/useCaseInterface/ticket/cancel-ticket-usecase.interface.js";












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
          console.log("req.body",req.body)

        const {ticket,email,phone,eventId,paymentIntentId,totalAmount,totalCount,vendorId} = req.body
        const {userId:clientId,role} = (req as CustomRequest).user 

        console.log("eventId", eventId)
        
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
        console.log('created ticket',stripeClientId, createdTicket)

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
              console.log('confirm ticket',ticket,paymentIntentId,vendorId)
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
            console.log(ticketId,eventId)
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
        console.log(ticketId)
        try {

            const cancelTicket = await this._cancelTicketUseCase.execute(
                ticketId,
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
