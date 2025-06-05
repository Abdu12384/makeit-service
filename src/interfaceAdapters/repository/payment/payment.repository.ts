import { paymentModel } from "../../../frameworks/database/mongodb/model/payment.model.js";
import { BaseRepository } from "../base.repository.js";
import { IPaymentModel } from "../../../frameworks/database/mongodb/model/payment.model.js";
import { IPaymentRepository } from "../../../domain/interface/repositoryInterfaces/payment/payment-repository.js";
import { injectable } from "tsyringe";





@injectable()
export class PaymentRepository extends BaseRepository<IPaymentModel> implements IPaymentRepository{
    constructor(){
        super(paymentModel)
    }
} 