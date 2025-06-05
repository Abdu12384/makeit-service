var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { paymentModel } from "../../../frameworks/database/mongodb/model/payment.model.js";
import { BaseRepository } from "../base.repository.js";
import { injectable } from "tsyringe";
let PaymentRepository = class PaymentRepository extends BaseRepository {
    constructor() {
        super(paymentModel);
    }
};
PaymentRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], PaymentRepository);
export { PaymentRepository };
//# sourceMappingURL=payment.repository.js.map