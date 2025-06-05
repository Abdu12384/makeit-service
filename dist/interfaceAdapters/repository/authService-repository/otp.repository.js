var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "tsyringe";
import { otpModel } from "../../../frameworks/database/mongodb/model/otp.model.js";
let OtpRepositroy = class OtpRepositroy {
    async saveOtp(otp) {
        await otpModel.findOneAndUpdate({ email: otp.email }, otp, { upsert: true });
    }
    async findOtpByEmail(email) {
        const otpData = await otpModel.findOne({ email });
        return otpData;
    }
    async deleteOtp(email) {
        await otpModel.deleteOne({ email });
    }
};
OtpRepositroy = __decorate([
    injectable()
], OtpRepositroy);
export { OtpRepositroy };
//# sourceMappingURL=otp.repository.js.map