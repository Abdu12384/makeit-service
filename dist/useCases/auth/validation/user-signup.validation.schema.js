"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemas = void 0;
const zod_1 = require("zod");
const email_validation_1 = require("../../../shared/validation/email.validation");
const name_validation_1 = require("../../../shared/validation/name.validation");
const password_validation_1 = require("../../../shared/validation/password.validation");
const phone_validaton_1 = require("../../../shared/validation/phone.validaton");
const clientSchema = zod_1.z.object({
    name: name_validation_1.nameSchema,
    email: email_validation_1.strongEmailRegex,
    phone: phone_validaton_1.phoneNumberSchema,
    password: password_validation_1.passwordSchema,
    role: zod_1.z.literal("client"),
});
const vendorSchema = zod_1.z.object({
    name: name_validation_1.nameSchema,
    email: email_validation_1.strongEmailRegex,
    phone: phone_validaton_1.phoneNumberSchema,
    password: password_validation_1.passwordSchema,
    idProof: zod_1.z.string().min(1, "ID proof is required"),
    role: zod_1.z.literal("vendor")
});
exports.userSchemas = {
    client: clientSchema,
    vendor: vendorSchema,
};
//# sourceMappingURL=user-signup.validation.schema.js.map