"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVendorStatusUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
let UpdateVendorStatusUseCase = class UpdateVendorStatusUseCase {
    constructor(_vendorRepository, _sendEmailUseCase) {
        this._vendorRepository = _vendorRepository;
        this._sendEmailUseCase = _sendEmailUseCase;
    }
    execute(id, status, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendor = yield this._vendorRepository.findOne({ userId: id });
            if (status === "rejected") {
                yield this._sendEmailUseCase.execute(vendor === null || vendor === void 0 ? void 0 : vendor.email, "MakeIt - Application rejected", (0, constants_1.VENDOR_APPLICATION_MAIL_CONTENT)(message, vendor === null || vendor === void 0 ? void 0 : vendor.name, status));
                yield this._vendorRepository.update({ userId: id }, { vendorStatus: "rejected" });
            }
            else {
                yield this._vendorRepository.update({ userId: id }, { vendorStatus: "approved" });
                yield this._sendEmailUseCase.execute(vendor === null || vendor === void 0 ? void 0 : vendor.email, "MakeIt - Application approved", (0, constants_1.VENDOR_APPLICATION_MAIL_CONTENT)("your requst approved by admin", vendor === null || vendor === void 0 ? void 0 : vendor.name, "approved"));
            }
        });
    }
};
exports.UpdateVendorStatusUseCase = UpdateVendorStatusUseCase;
exports.UpdateVendorStatusUseCase = UpdateVendorStatusUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IVendorRepository")),
    __param(1, (0, tsyringe_1.inject)("ISendEmailUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], UpdateVendorStatusUseCase);
//# sourceMappingURL=update-vendor-status.usecase.js.map