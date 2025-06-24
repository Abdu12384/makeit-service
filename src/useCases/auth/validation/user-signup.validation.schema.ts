import {z} from 'zod'
import { strongEmailRegex } from '../../../shared/validation/email.validation'
import { nameSchema } from '../../../shared/validation/name.validation'
import { passwordSchema } from '../../../shared/validation/password.validation'
import { phoneNumberSchema } from '../../../shared/validation/phone.validaton'



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
	 idProof:z.string().min(1,"ID proof is required"),
	 role: z.literal("vendor")
})


export const userSchemas = {
	// admin: adminSchema,
	client: clientSchema,
	vendor: vendorSchema,
};

