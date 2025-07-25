import { IBaseRepository } from "../base-repository.interface";
import { IPaymentModel } from "../../../../frameworks/database/mongodb/model/payment.model";

export interface IPaymentRepository extends IBaseRepository<IPaymentModel>{
    
}
