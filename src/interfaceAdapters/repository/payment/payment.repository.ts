import { paymentModel } from "../../../frameworks/database/mongodb/model/payment.model";
import { BaseRepository } from "../base.repository";
import { IPaymentModel } from "../../../frameworks/database/mongodb/model/payment.model";
import { IPaymentRepository } from "../../../domain/interface/repositoryInterfaces/payment/payment-repository";
import { injectable } from "tsyringe";





@injectable()
export class PaymentRepository extends BaseRepository<IPaymentModel> implements IPaymentRepository{
    constructor(){
        super(paymentModel)
    }
} 