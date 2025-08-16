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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseTicketDto = exports.TicketDto = void 0;
const class_validator_1 = require("class-validator");
class TicketDto {
}
exports.TicketDto = TicketDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TicketDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], TicketDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TicketDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TicketDto.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TicketDto.prototype, "paymentMethod", void 0);
class PurchaseTicketDto {
}
exports.PurchaseTicketDto = PurchaseTicketDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PurchaseTicketDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseTicketDto.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", TicketDto)
], PurchaseTicketDto.prototype, "ticket", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseTicketDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PurchaseTicketDto.prototype, "totalTicketCount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseTicketDto.prototype, "vendorId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseTicketDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=ticket-requst.dto.js.map