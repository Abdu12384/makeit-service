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
exports.FormDataDto = void 0;
const class_validator_1 = require("class-validator");
class FormDataDto {
}
exports.FormDataDto = FormDataDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormDataDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], FormDataDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], FormDataDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], FormDataDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^\d{10}$/, { message: 'Phone number must be 10 digits' }),
    __metadata("design:type", String)
], FormDataDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.role === 'vendor'),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID Proof is required for vendors' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormDataDto.prototype, "idProof", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormDataDto.prototype, "role", void 0);
//# sourceMappingURL=formdata.dto.js.map