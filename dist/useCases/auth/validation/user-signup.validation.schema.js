import { z } from 'zod';
import { strongEmailRegex } from '../../../shared/validation/email.validation.js';
import { nameSchema } from '../../../shared/validation/name.validation.js';
import { passwordSchema } from '../../../shared/validation/password.validation.js';
import { phoneNumberSchema } from '../../../shared/validation/phone.validaton.js';
// const adminSchema = z.object({
// 	email: strongEmailRegex,
// 	password: passwordSchema,
// 	role: z.literal("admin"),
// });
const clientSchema = z.object({
    name: nameSchema,
    email: strongEmailRegex,
    phone: phoneNumberSchema,
    password: passwordSchema,
    role: z.literal("client"),
});
const vendorSchema = z.object({
    name: nameSchema,
    email: strongEmailRegex,
    phone: phoneNumberSchema,
    password: passwordSchema,
    idProof: z.string().min(1, "ID proof is required"),
    role: z.literal("vendor")
});
export const userSchemas = {
    // admin: adminSchema,
    client: clientSchema,
    vendor: vendorSchema,
};
//# sourceMappingURL=user-signup.validation.schema.js.map