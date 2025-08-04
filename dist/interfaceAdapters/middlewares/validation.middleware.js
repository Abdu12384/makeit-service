"use strict";
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
exports.validateDto = validateDto;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../shared/constants");
function validateDto(DtoClass) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const dtoObject = (0, class_transformer_1.plainToInstance)(DtoClass, req.body);
        const errors = yield (0, class_validator_1.validate)(dtoObject);
        if (errors.length > 0) {
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                message: 'Validation failed',
                errors: errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints,
                })),
            });
            return;
        }
        req.body.validatedDto = dtoObject;
        next();
    });
}
//# sourceMappingURL=validation.middleware.js.map