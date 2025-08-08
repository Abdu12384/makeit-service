import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IPaymentController } from "../../domain/interface/controllerInterfaces/payment/payment-cantroller.interface";
import { handleErrorResponse } from "../../shared/utils/error.handler";
import { HTTP_STATUS } from "../../shared/constants";
import { IBookingPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-payment-usecase.interface";
import { IBookingConfirmPaymentUseCase } from "../../domain/interface/useCaseInterface/booking/booking-confirm-payment-usecase.interface";
import { CustomRequest } from "../middlewares/auth.middleware";











@injectable()
export class PaymentController implements IPaymentController{
    constructor(
      @inject("IBookingPaymentUseCase")
      private _createBookingPaymentUseCase: IBookingPaymentUseCase,
      @inject("IBookingConfirmPaymentUseCase")
      private _confirmPayment: IBookingConfirmPaymentUseCase
    ){}



// ══════════════════════════════════════════════════════════
//  Handle Booking Payment 
// ══════════════════════════════════════════════════════════

    async handleBookingPayment(req:Request,res:Response): Promise<void>{
        try {

          const {bookingId, paymentIntentId,bookingDetails} = req.body

          const {userId} = (req as CustomRequest).user
          const {clientStripeId,booking} = await this._createBookingPaymentUseCase.confirmPayment(
          paymentIntentId,
          bookingId,
          bookingDetails,
          userId
        )
         res.status(HTTP_STATUS.OK).json({
            success:true,
            clientStripeId,
            booking,
         })
            
        } catch (error) {
            handleErrorResponse(req,res,error)
        }
    }


// ══════════════════════════════════════════════════════════
//  Confirm Payment 
// ══════════════════════════════════════════════════════════

    async confirmPayment(req:Request,res:Response): Promise<void>{
        try {

          const {booking, paymentIntentId} = req.body
            await this._confirmPayment.confirmPayment(
            paymentIntentId,
            booking,
          )
          res.status(HTTP_STATUS.OK).json({
            success:true,
            message:"Payment Confirmed"
          })
            
        } catch (error) {
            handleErrorResponse(req,res,error)
        }


  }
}